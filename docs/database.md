# Veritabanı — Supabase Altyapısı (Faz 2.1)

Bu doküman, Stüdyo Zorbey projesinin Supabase (Postgres) veritabanı temelini
açıklar. Bu aşamada **sadece altyapı** kuruldu: auth ekranları, admin paneli
ve public form gönderimleri henüz yok (bkz. Faz 2.2+).

## 1. Environment değişkenleri

`.env.example` dosyasına bakın. Gerekli değerler Supabase Dashboard →
Project Settings → API sayfasından alınır:

| Değişken | Nerede kullanılır | Client'a açık mı? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts` | Evet |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | aynı | Evet (RLS ile korunur) |
| `SUPABASE_SERVICE_ROLE_KEY` | Bu fazda **kullanılmıyor**; ileride sadece server-only kodda | Hayır — asla `NEXT_PUBLIC_` alamaz |

`.env.local` git'e dahil edilmez (`.gitignore` içinde `.env*` kuralı var,
sadece `.env.example` istisna tutuldu).

## 2. Supabase client katmanı — `src/lib/supabase/`

- `env.ts` — env değişkenlerini okuyan, eksikse anlamlı hata fırlatan yardımcılar.
- `client.ts` — Client Component'lerde (`"use client"`) kullanılacak browser client (`createBrowserClient`).
- `server.ts` — Server Component / Server Function / Route Handler'larda kullanılacak client (`createServerClient`, Next.js'in async `cookies()` API'siyle).
- `middleware.ts` — `updateSession()` yardımcı fonksiyonu. **Henüz hiçbir yerden çağrılmıyor.** Next.js 16'da `middleware.ts` dosya adı deprecated olup `proxy.ts` ile değiştirildiği için (bkz. `node_modules/next/dist/docs/.../proxy.md`), Faz 2.2'de auth kurulduğunda proje köküne bir `proxy.ts` eklenip bu fonksiyon oradan çağrılacak.

İkisi de `src/types/database.ts` içindeki `Database` tipiyle generic olarak tiplenmiştir, yani `supabase.from("services").select()` gibi çağrılar otomatik tip güvenliği sağlar.

## 3. Tablolar ve ilişkiler

| Tablo | Amaç | Foreign key(ler) | Silme davranışı |
| --- | --- | --- | --- |
| `profiles` | Admin/editor kullanıcı profilleri | `id → auth.users.id` | `CASCADE` (auth kullanıcısı silinirse profil de silinir) |
| `services` | Hizmetler | — | — |
| `portfolio_categories` | Portfolyo kategorileri | — | — |
| `portfolio_projects` | Portfolyo projeleri | `category_id → portfolio_categories.id` | `RESTRICT` — kategori, altında proje varken silinemez (URL/SEO bütünlüğü için bilinçli tercih) |
| `portfolio_images` | Proje galeri görselleri | `project_id → portfolio_projects.id` | `CASCADE` — proje silinince görselleri de silinir |
| `videos` | Video içerikleri | — | — |
| `blog_categories` | Blog kategorileri | — | — |
| `blog_posts` | Blog yazıları | `category_id → blog_categories.id` | `SET NULL` — kategori silinse de yazı kalır, sadece kategorisiz kalır (bilinçli olarak `portfolio_projects`'ten farklı, daha esnek davranış) |
| `appointments` | Randevu talepleri | `service_id → services.id` | `SET NULL` — hizmet silinse de talep kaydı (iş/hukuki nedenle) kalır |
| `quote_requests` | Teklif talepleri | `service_id → services.id` | `SET NULL` |
| `contact_messages` | İletişim mesajları | — | — |
| `testimonials` | Müşteri yorumları | — | — |
| `site_settings` | Genel site ayarları (key/value, `jsonb`) | — | — |
| `seo_settings` | Sayfa bazlı SEO/meta ayarları | — | — |
| `media` | Storage'a yüklenen dosyaların metadata'sı | — (bağımsız kütüphane) | — |

Tüm tablolarda `id uuid primary key default gen_random_uuid()` (Postgres
13+ çekirdek fonksiyonu, ekstra extension gerekmez) ve — spesifikasyonda
belirtildiği şekilde — çoğu tabloda `created_at` / `updated_at`
(`portfolio_images`, `blog_categories`, `media` hariç — bunlar sadece
`created_at` taşır; `seo_settings` ve `site_settings` sadece `updated_at`
taşır, spesifikasyondaki alan listeleriyle birebir uyumludur).

`updated_at` her UPDATE'te otomatik olarak `now()`'a çekilir
(`public.set_updated_at()` trigger fonksiyonu, `20260910120000_helper_functions.sql`).

## 4. Indexler

Gereksiz index üretmemek için sadece gerçek sorgu paternlerine göre eklendi:

- **Slug benzersizliği**: `services`, `portfolio_categories`, `portfolio_projects`, `videos`, `blog_categories`, `blog_posts` → `unique` constraint (otomatik bir b-tree index de oluşturur).
- **Aktif + sıralı listeleme** (`WHERE is_active = true ORDER BY sort_order`): `services`, `portfolio_categories`, `portfolio_projects`, `videos`, `testimonials` → composite `(is_active, sort_order)` index.
- **Öne çıkanlar** (`WHERE is_featured = true`): `services`, `portfolio_projects`, `videos`, `blog_posts`, `testimonials` → partial index (`WHERE is_featured = true`).
- **Yayın durumu**: `blog_posts` → `(status, published_at desc)`.
- **Lead yönetimi**: `appointments`, `quote_requests`, `contact_messages` → `status` ve `created_at desc` (admin panelde "yeni talepler" listesi için).
- **Foreign key aramaları**: `portfolio_projects.category_id`, `portfolio_images.project_id` (+ `(project_id, sort_order)`), `blog_posts.category_id`, `appointments.service_id`, `quote_requests.service_id`.
- **Medya klasörleri**: `media.folder`, `media.created_at desc`.

## 5. RLS (Row Level Security) stratejisi

Tüm tablolarda RLS **açık**. Varsayılan durum: hiçbir erişim yok, sadece
aşağıdaki politikalar izin verir.

- **Public SELECT** (anon + authenticated): sadece "aktif/yayınlanmış" satırlar —
  `services`/`portfolio_categories`/`portfolio_projects`/`videos`/`testimonials`
  → `is_active = true`; `portfolio_images` → bağlı olduğu projenin aktif olması;
  `blog_posts` → `status = 'published'`; `blog_categories`/`site_settings`/`seo_settings`
  → tamamen açık (zaten yalnızca public-safe alanlar içeriyorlar).
- **Public INSERT**: sadece `appointments`, `quote_requests`, `contact_messages`.
  `WITH CHECK` koşulu `status = 'new' AND notes IS NULL` (contact_messages'ta
  sadece `status = 'new'`, çünkü o tabloda `notes` yok) — bir ziyaretçinin
  kendi talebini "confirmed" gibi işaretlemesi veya admin notu enjekte etmesi
  engellenir.
- **Public UPDATE/DELETE**: **hiçbir tabloda yok.**
- **Admin/editor**: `public.is_admin_or_editor()` (SECURITY DEFINER fonksiyon,
  `profiles.role IN ('admin','editor')` kontrolü) `true` dönerse tüm içerik ve
  lead tablolarında tam CRUD. Auth henüz kurulmadığı için bu politikalar şu an
  fiilen hiçbir isteğe izin vermiyor (hiçbir authenticated kullanıcı yok) —
  bu, güvenli bir "varsayılan kapalı" başlangıç durumudur.
- **profiles**: kullanıcı sadece kendi satırını görebilir/güncelleyebilir;
  `public.is_admin()` ise tümünü yönetebilir.
- **`service_role` key**: RLS'i tamamen bypass eder. Bu fazda hiçbir kod bu
  anahtarı kullanmıyor ve client'a **asla** açılmamalı.

## 6. Migration çalışma mantığı

`supabase/migrations/*.sql` dosyaları, dosya adındaki zaman damgasına göre
sırayla uygulanır (Supabase CLI standart konvansiyonu). Sıra:

1. `helper_functions` — `set_updated_at()` trigger fonksiyonu
2. `profiles`
3. `auth_helper_functions` — `is_admin()`, `is_admin_or_editor()` (profiles'a bağımlı)
4. `services`
5. `portfolio` — categories + projects + images
6. `videos`
7. `blog` — categories + posts
8. `leads` — appointments + quote_requests + contact_messages
9. `testimonials`
10. `site_and_seo_settings`
11. `media`
12. `rls_policies` — tüm tablolarda RLS + politikalar (en son, tüm tablolar var olduktan sonra)

`supabase/seed.sql` sadece local/dev ortamı için `site_settings` anahtarlarının
iskeletini (gerçek olmayan/boş değerlerle) tanımlar; gerçek müşteri verisi
içermez.

**Bu migration'lar henüz hiçbir Supabase projesine (local veya production)
push edilmedi.** Gerçek bir projeye uygulamak için:

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push
```

## 7. Public sitede değişiklik yok

Bu fazda `src/app/(site)/`, `src/components/`, `src/data/`, `src/config/`
altındaki hiçbir dosya değiştirilmedi. Public site hâlâ statik veriyle
(`src/data/*.ts`) çalışıyor. Supabase verisine bağlama işi ileriki bir fazda
yapılacak.
