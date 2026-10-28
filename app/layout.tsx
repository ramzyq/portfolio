import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Dock } from "@/components/site/Dock";
import { FixedFooter } from "@/components/site/FixedFooter";
import { OWNER } from "@/data";
import "./globals.css";

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ramzy.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${OWNER.fullName} — ${OWNER.tagline}`,
    template: `%s · ${OWNER.shortName}`,
  },
  description: OWNER.bioShort,
  keywords: [
    "Konde Ramzy Gbati",
    "Ramzy",
    "Flutter Developer",
    "Product Designer",
    "Cybersecurity",
    "STEM Educator",
    "Ghana",
    "University of Ghana",
    "Portfolio",
  ],
  authors: [{ name: OWNER.fullName }],
  creator: OWNER.fullName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: `${OWNER.fullName} — ${OWNER.tagline}`,
    description: OWNER.bioShort,
    siteName: `${OWNER.shortName} · Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${OWNER.fullName} — ${OWNER.tagline}`,
    description: OWNER.bioShort,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className={`${manrope.className} bg-white text-ink antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <div className="min-h-screen pb-48 md:pb-36">{children}</div>
        <FixedFooter />
        <Dock />
      </body>
    </html>
  );
}
