"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminSection } from "@/components/admin/AdminSection";
import { WORKING_HOURS_DAYS, type WorkingHours } from "@/lib/admin/site-settings";
import type { SiteSettingsActionState } from "@/app/admin/(protected)/ayarlar/actions";

type SiteSettingsFormProps = {
  action: (
    prevState: SiteSettingsActionState,
    formData: FormData,
  ) => Promise<SiteSettingsActionState>;
  values: Record<string, string>;
  workingHours: WorkingHours;
};

const initialState: SiteSettingsActionState = {};

export function SiteSettingsForm({ action, values, workingHours }: SiteSettingsFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          aria-live="polite"
          className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          Site ayarları kaydedildi.
        </p>
      )}

      <AdminSection title="İletişim Bilgileri">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-phone">Telefon</Label>
            <Input id="settings-phone" name="phone" defaultValue={values.phone ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-whatsapp">WhatsApp</Label>
            <Input
              id="settings-whatsapp"
              name="whatsapp"
              placeholder="90XXXXXXXXXX"
              defaultValue={values.whatsapp ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-email">E-posta</Label>
            <Input
              id="settings-email"
              name="email"
              type="email"
              defaultValue={values.email ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-instagram">Instagram Bağlantısı</Label>
            <Input
              id="settings-instagram"
              name="instagram_url"
              type="url"
              placeholder="https://instagram.com/..."
              defaultValue={values.instagram_url ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="settings-address">Adres</Label>
            <Textarea
              id="settings-address"
              name="address"
              rows={2}
              defaultValue={values.address ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="settings-maps">Google Maps Bağlantısı</Label>
            <Input
              id="settings-maps"
              name="maps_embed"
              type="url"
              placeholder="https://maps.google.com/..."
              defaultValue={values.maps_embed ?? ""}
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection title="Çalışma Saatleri">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKING_HOURS_DAYS.map((day) => (
            <div key={day.key} className="flex flex-col gap-2">
              <Label htmlFor={`settings-hours-${day.key}`}>{day.label}</Label>
              <Input
                id={`settings-hours-${day.key}`}
                name={`working_hours_${day.key}`}
                placeholder="09:00 - 18:00"
                defaultValue={workingHours[day.key] ?? ""}
              />
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection
        title="Anasayfa Hero Alanı"
        description="Anasayfadaki büyük karşılama bölümünde gösterilebilecek metinler."
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="settings-hero-title">Başlık</Label>
            <Input
              id="settings-hero-title"
              name="hero_title"
              defaultValue={values.hero_title ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="settings-hero-subtitle">Alt Başlık</Label>
            <Textarea
              id="settings-hero-subtitle"
              name="hero_subtitle"
              rows={2}
              defaultValue={values.hero_subtitle ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-hero-cta-label">CTA Buton Metni</Label>
            <Input
              id="settings-hero-cta-label"
              name="hero_cta_label"
              defaultValue={values.hero_cta_label ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-hero-cta-href">CTA Bağlantısı</Label>
            <Input
              id="settings-hero-cta-href"
              name="hero_cta_href"
              placeholder="/iletisim"
              defaultValue={values.hero_cta_href ?? ""}
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection title="Footer">
        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-footer-text">Footer Metni</Label>
          <Textarea
            id="settings-footer-text"
            name="footer_text"
            rows={3}
            defaultValue={values.footer_text ?? ""}
          />
        </div>
      </AdminSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8">
        <Button type="submit" loading={pending}>
          Ayarları Kaydet
        </Button>
      </div>
    </form>
  );
}
