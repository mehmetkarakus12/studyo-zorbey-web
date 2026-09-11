import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { getRoleLabel } from "@/lib/admin-role-labels";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

/**
 * `/admin` altında `(protected)` route group'una giren TÜM sayfalar
 * (dashboard + Faz 2.4'te eklenecek CRUD sayfaları) bu layout üzerinden
 * geçer. `requireAdminSession()` oturum + profiles.role kontrolünü yapar
 * ve geçersizse `/admin/login`'e yönlendirir — `/admin/login` sayfası
 * (protected) grubunda OLMADIĞI için bu kontrole hiç takılmaz (redirect
 * loop oluşmaz). Bu, Faz 2.2'de kurulan koruma mantığının aynısıdır;
 * burada sadece görsel kabuk (sidebar/topbar) eklendi.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireAdminSession();
  const displayName = profile.full_name || user.email;
  const roleLabel = getRoleLabel(profile.role);

  return (
    <div className="flex min-h-svh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          displayName={displayName}
          email={user.email}
          roleLabel={roleLabel}
        />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
