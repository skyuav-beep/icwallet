'use client';

import Link from "next/link";
import { useTranslatePair } from "../../lib/i18n/provider";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const translatePair = useTranslatePair();
  const navItems = [
    { href: "/wallet", pair: translatePair("nav.wallet") },
    { href: "/nft-market", pair: translatePair("nav.nftMarket") },
    { href: "/p2p", pair: translatePair("nav.p2p") },
    { href: "/mining", pair: translatePair("nav.mining") },
    { href: "/earn", pair: translatePair("nav.earn") },
    { href: "/store", pair: translatePair("nav.store") },
    { href: "/merchants", pair: translatePair("nav.merchants") },
    { href: "/me", pair: translatePair("nav.me") },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
              IC Wallet Navigation / IC 월렛 내비게이션
            </p>
            <h1 className="text-lg font-semibold sm:text-xl">
              User Application Shell
              <span className="block text-sm font-normal text-neutral-500 dark:text-neutral-400">
                사용자 앱 골격
              </span>
            </h1>
          </div>
          <nav aria-label="Primary">
            <ul className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:text-white"
                    href={item.href}
                  >
                    <span>{item.pair.en}</span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      {item.pair.ko}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
        {children}
      </main>
    </div>
  );
}
