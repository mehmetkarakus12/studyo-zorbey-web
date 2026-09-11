"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

/**
 * Supabase'in teknik hata mesajlarını (ör. "Invalid login credentials")
 * kullanıcıya birebir göstermek yerine anlaşılır Türkçe karşılıklarına
 * çeviriyoruz. Hiçbir zaman sunucu/hata detayını (token, stack, kod)
 * kullanıcıya veya console'a yazmıyoruz.
 */
function toFriendlyMessage(rawMessage: string | undefined): string {
  const message = rawMessage?.toLowerCase() ?? "";

  if (message.includes("invalid login credentials")) {
    return "E-posta veya şifre hatalı.";
  }
  if (message.includes("email not confirmed")) {
    return "Bu hesap için e-posta doğrulaması tamamlanmamış.";
  }
  if (message.includes("too many requests") || message.includes("rate limit")) {
    return "Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.";
  }
  return "Giriş yapılamadı. Lütfen tekrar deneyin.";
}

const UNAUTHORIZED_MESSAGE =
  "Bu hesabın yönetim paneline erişim yetkisi yok.";
const NETWORK_ERROR_MESSAGE =
  "Bağlantı sorunu oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(toFriendlyMessage(signInError.message));
        setLoading(false);
        return;
      }

      const user = signInData.user;
      if (!user) {
        setError(toFriendlyMessage(undefined));
        setLoading(false);
        return;
      }

      // Supabase Auth oturumu başarılı olsa bile, admin paneline girmek
      // için ayrıca profiles.role'ün admin/editor olması şart (bkz.
      // src/lib/supabase/admin-auth.ts — sunucu tarafında da aynı kontrol
      // tekrar yapılır, burası sadece daha iyi bir kullanıcı deneyimi için).
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
        await supabase.auth.signOut();
        setError(UNAUTHORIZED_MESSAGE);
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError(NETWORK_ERROR_MESSAGE);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-email">E-posta</Label>
        <Input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-password">Şifre</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
        />
      </div>

      {error && (
        <p role="alert" aria-live="polite" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} className="mt-2 w-full">
        Giriş Yap
      </Button>
    </form>
  );
}
