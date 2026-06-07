import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cut & Sear | Master the Art of Cooking",
  description:
    "Expert guides on cutting, searing, and perfectly preparing premium ingredients.",
};

import CookieBanner from "@/components/CookieBanner";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "text-stone-800", "bg-white", inter.variable, playfair.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <NextTopLoader
          color="#ea580c"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ea580c,0 0 5px #ea580c"
        />
        {children}
        <CookieBanner />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WVE9J1WNY1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WVE9J1WNY1');
          `}
        </Script>
      </body>
    </html>
  );
}
