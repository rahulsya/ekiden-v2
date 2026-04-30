import type { Metadata } from "next";
import { Inter, Lexend, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SessionProviders from "@/components/layouts/session-provider";
import QueryProvider from "@/components/layouts/query-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ekiden",
  description: "Strava Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lexend.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="mx-auto h-screen w-full max-w-md bg-background shadow-2xl">
        <SessionProviders>
          <QueryProvider>{children}</QueryProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
