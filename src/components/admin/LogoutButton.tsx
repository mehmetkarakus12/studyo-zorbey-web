"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  /**
   * "default": genel amaçlı outline buton (ör. Faz 2.2 dashboard'unda
   * kullanılmıştı). "sidebar": koyu sidebar'daki nav linkleriyle aynı
   * görünüme sahip, ikonlu bir satır.
   */
  variant?: "default" | "sidebar";
};

export function LogoutButton({ variant = "default" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={cn(
          "flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white",
          "disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        {loading ? "Çıkış yapılıyor…" : "Çıkış Yap"}
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      loading={loading}
      onClick={handleLogout}
    >
      Çıkış Yap
    </Button>
  );
}
