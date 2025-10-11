import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "../lib/i18n/provider";
import { LanguageSwitcher } from "../components/i18n/LanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IC Wallet Console",
  description:
    "IC Wallet front-end workspace for user, merchant, and admin portals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <I18nProvider>
          <div className="flex min-h-screen flex-col">
            <div className="border-b border-neutral-200 bg-white/50 px-6 py-2 text-right text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 sm:px-10">
              <LanguageSwitcher />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
