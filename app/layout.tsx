import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Dock } from "@/components/site/Dock";
import { FixedFooter } from "@/components/site/FixedFooter";
import { OWNER } from "@/data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-white text-ink antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <div className="min-h-screen pb-[190px] md:pb-[140px]">{children}</div>
        <FixedFooter />
        <Dock />
      </body>
    </html>
  );
}
