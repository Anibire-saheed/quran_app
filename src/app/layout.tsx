import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import AudioPlayer from "@/components/features/AudioPlayer";
import ThemeProvider from "@/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "Modern Quran App | Read & Listen",
  description: "A premium, high-performance Quran platform with exceptional audio experience and beautiful Islamic design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${amiri.variable} antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider>
              {children}
              <AudioPlayer />
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
