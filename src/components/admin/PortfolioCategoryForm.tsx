"use client";

import { useActionState, useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminSection } from "@/components/admin/AdminSection";
import { AdminToggleField } from "@/components/admin/AdminToggleField";
import { slugify } from "@/lib/admin/slugify";
import type { PortfolioCategoryActionState } from "@/app/admin/(protected)/portfolyo/kategoriler/actions";
import type { Tables } from "@/types/database";

type PortfolioCategoryFormProps = {
  mode: "create" | "edit";
  action: (
    prevState: PortfolioCategoryActionState,
    formData: FormData,
  ) => Promise<PortfolioCategoryActionState>;
  initialValues?: Tables<"portfolio_categories">;
};

const initialState: PortfolioCategoryActionState = {};

export function PortfolioCategoryForm({
  mode,
  action,
  initialValues,
}: PortfolioCategoryFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  function handleNameChange(value: string) {
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

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

      <AdminSection title="Temel Bilgiler">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category-name">Kategori Adı</Label>
            <Input
              id="category-name"
              name="name"
              required
              defaultValue={initialValues?.name}
              onChange={(event) => handleNameChange(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.name)}
              aria-describedby={
                state.fieldErrors?.name ? "category-name-error" : undefined
              }
            />
            {state.fieldErrors?.name && (
              <p id="category-name-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-slug">Slug</Label>
            <Input
              id="category-slug"
              name="slug"
              required
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              aria-invalid={Boolean(state.fieldErrors?.slug)}
              aria-describedby={
                state.fieldErrors?.slug ? "category-slug-error" : "category-slug-hint"
              }
            />
            {state.fieldErrors?.slug ? (
              <p id="category-slug-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.slug}
              </p>
            ) : (
              <p id="category-slug-hint" className="text-xs text-muted-foreground">
                Web adresinde görünecek — kategori adından otomatik oluşturulur,
                isterseniz değiştirebilirsiniz.
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <AdminSection title="İçerik">
        <div className="flex flex-col gap-2">
          <Label htmlFor="category-description">Açıklama</Label>
          <Textarea
            id="category-description"
            name="description"
            rows={4}
            defaultValue={initialValues?.description ?? ""}
          />
        </div>
      </AdminSection>

      <AdminSection title="Yayın Ayarları">
        <div className="flex flex-col gap-4">
          <AdminToggleField
            name="is_active"
            label="Aktif"
            description="Kapalıyken bu kategori public sitede gösterilmez."
            defaultChecked={initialValues?.is_active ?? true}
          />
          <div className="flex flex-col gap-2 sm:w-48">
            <Label htmlFor="category-sort-order">Sıralama</Label>
            <Input
              id="category-sort-order"
              name="sort_order"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={initialValues?.sort_order ?? 0}
              aria-invalid={Boolean(state.fieldErrors?.sort_order)}
              aria-describedby={
                state.fieldErrors?.sort_order ? "category-sort-order-error" : undefined
              }
            />
            {state.fieldErrors?.sort_order && (
              <p
                id="category-sort-order-error"
                role="alert"
                className="text-xs text-red-700"
              >
                {state.fieldErrors.sort_order}
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Kategoriyi Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
        <Button href="/admin/portfolyo/kategoriler" variant="outline">
          Vazgeç
        </Button>
      </div>
    </form>
  );
}
