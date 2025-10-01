import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import DreamNavigation from "./components/ui/DreamNavigation";
import { AuthProvider } from "./components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alchera - AI-Powered Dream Analysis",
  description: "Discover the hidden meanings in your dreams with AI-powered Jungian analysis. Explore archetypes, symbols, and themes from the collective unconscious.",
  keywords: ["dream analysis", "Jungian psychology", "AI", "archetypes", "dream interpretation", "subconscious", "dream symbols"],
  authors: [{ name: "Alchera Team" }],
  creator: "Alchera",
  publisher: "Alchera",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jungian-dream-weaver.vercel.app/',
    siteName: 'Alchera',
    title: 'Alchera - AI-Powered Dream Analysis',
    description: 'Discover the hidden meanings in your dreams with AI-powered Jungian analysis. Explore archetypes, symbols, and themes from the collective unconscious.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Alchera - Dream Analysis App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@alchera_app',
    creator: '@alchera_app',
    title: 'Alchera - AI-Powered Dream Analysis',
    description: 'Discover the hidden meanings in your dreams with AI-powered Jungian analysis. Explore archetypes, symbols, and themes from the collective unconscious.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://jungian-dream-weaver.vercel.app/'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <DreamNavigation />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
