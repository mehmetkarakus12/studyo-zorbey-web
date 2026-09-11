import type { NextConfig } from "next";

/**
 * Supabase Storage `site-media` bucket'ındaki görseller (admin panelden
 * yüklenen hizmet/portfolyo/blog/video/SEO görselleri) next/image ile
 * render edilebilsin diye izin verilen tek harici host. Proje referansı
 * `NEXT_PUBLIC_SUPABASE_URL`'den türetilir; env yoksa (ör. lint/CI ortamı)
 * build'i kırmamak için sessizce atlanır.
 */
function supabaseStorageRemotePattern() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;

  try {
    const hostname = new URL(url).hostname;
    return {
      protocol: "https" as const,
      hostname,
      pathname: "/storage/v1/object/public/**",
    };
  } catch {
    return null;
  }
}

const supabasePattern = supabaseStorageRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabasePattern ? [supabasePattern] : [],
  },
};

export default nextConfig;
