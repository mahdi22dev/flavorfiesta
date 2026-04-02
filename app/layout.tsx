import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlavorFiesta | Delicious Recipes",
  description: "Find the best fresh, vibrant recipes for every season.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} font-sans h-full antialiased text-stone-800 bg-white`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
