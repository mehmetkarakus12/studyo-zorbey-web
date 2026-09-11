import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Yönetim Girişi",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Zaten giriş yapmış VE yetkili bir kullanıcı bu sayfaya gelirse /admin'e
  // yönlendir. Yetkisiz bir oturum varsa (ör. profili silinmiş bir
  // kullanıcı) burada TAKILI KALMASI daha güvenlidir — /admin'e
  // yönlendirip oradan tekrar buraya atılması bir redirect loop'una yol
  // açardı, bu yüzden sadece geçerli admin/editor rolü olduğunda yönlendirir.
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile && (profile.role === "admin" || profile.role === "editor")) {
      redirect("/admin");
    }
  }

  return (
    <Container size="narrow">
      <div className="flex min-h-[70svh] items-center justify-center py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            <Logo size="sm" />
            <span className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              Yönetim Girişi
            </span>
            <h1 className="font-display text-3xl leading-[1.15] font-normal">
              Hoş Geldiniz
            </h1>
            <p className="text-sm text-muted-foreground">
              Devam etmek için hesap bilgilerinizle giriş yapın.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </Container>
  );
}
