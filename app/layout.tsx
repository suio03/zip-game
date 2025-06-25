import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zip Game - The Ultimate Connect-the-Dots Puzzle!",
  description: "Fill all cells and connect all dots in sequence - Fun Zip Game",
  alternates: {
    canonical: "https://zipgame.net",
  },
  openGraph: {
    title: "Zip Game - The Ultimate Connect-the-Dots Puzzle!",
    description: "Fill all cells and connect all dots in sequence - Fun Zip Game",
    url: "https://zipgame.net",
    siteName: "Zip Game",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
                    <Analytics />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
