import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { siteConfig } from "@/config/site";
import { defaultOgImage } from "@/lib/seo";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brandName} | ${siteConfig.positioning}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: siteConfig.brandName,
    title: siteConfig.brandName,
    description: siteConfig.description,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.brandName,
    description: siteConfig.description,
    images: [defaultOgImage.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-svh bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
