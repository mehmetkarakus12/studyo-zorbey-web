import { Loader2 } from "lucide-react";

/**
 * Bilinçli olarak minimal — sayfalar arası geçiş çoğunlukla anlık olduğu
 * için tam ekran/karmaşık bir loading deneyimi yerine tek bir küçük
 * gösterge yeterli.
 */
export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-24 text-muted-foreground">
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="sr-only">Yükleniyor…</span>
    </div>
  );
}
