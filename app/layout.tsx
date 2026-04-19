import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { OWNER } from "@/data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${OWNER.fullName} — ${OWNER.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${OWNER.fullName} — ${OWNER.tagline}`,
    description: OWNER.bioShort,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
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
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
