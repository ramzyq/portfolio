import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BootIntro } from "@/components/site/BootIntro";
import { CtfTracker } from "@/components/site/CtfTracker";
import { Dock } from "@/components/site/Dock";
import { EasterEggs } from "@/components/site/EasterEggs";
import { FixedFooter } from "@/components/site/FixedFooter";
import { Robot } from "@/components/site/Robot";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { SystemHud } from "@/components/site/SystemHud";
import { Terminal } from "@/components/site/Terminal";
import { Toaster } from "@/components/site/Toaster";
import { TechBackdrop } from "@/components/site/TechBackdrop";
import { ThemeColorSync } from "@/components/site/ThemeColorSync";
import { OWNER } from "@/data";
import { BOOT_INLINE_SCRIPT } from "@/lib/boot";
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
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: `Portrait of ${OWNER.fullName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${OWNER.fullName} — ${OWNER.tagline}`,
    description: OWNER.bioShort,
    images: ["/og-cover.jpg"],
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={manrope.variable}
      suppressHydrationWarning
    >
      <body
        className={`${manrope.className} bg-background text-foreground antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: BOOT_INLINE_SCRIPT }} />
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html:
              "<!-- 👀 Source reader! Flag 1 of 6: KRG{v13w_s0urc3_l1k3_4_pr0} · submit it in the terminal (press `) -->",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <div className="ambient-orb ambient-orb-a orb-drift-a" />
          <div className="ambient-orb ambient-orb-b orb-drift-b" />
          <div className="ambient-orb ambient-orb-c orb-drift-c" />
        </div>
        <TechBackdrop />
        <ScrollProgress />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeColorSync />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-background"
          >
            Skip to content
          </a>
          <div className="relative z-10 min-h-screen pb-24">
            {children}
            <div aria-hidden="true" className="h-24 md:h-12" />
          </div>
          <FixedFooter />
          <Dock />
          <SystemHud />
          <CtfTracker />
          <Robot />
          <Terminal />
          <Toaster />
          <EasterEggs />
        </ThemeProvider>
        <BootIntro />
      </body>
    </html>
  );
}
