'use client';

import Link from "next/link";
import { useTranslatePair } from "../lib/i18n/provider";

export default function Home() {
  const translatePair = useTranslatePair();
  const routeLinks = [
    { href: "/wallet", pair: translatePair("nav.wallet") },
    { href: "/nft-market", pair: translatePair("nav.nftMarket") },
    { href: "/p2p", pair: translatePair("nav.p2p") },
    { href: "/mining", pair: translatePair("nav.mining") },
    { href: "/earn", pair: translatePair("nav.earn") },
    { href: "/store", pair: translatePair("nav.store") },
    { href: "/merchants", pair: translatePair("nav.merchants") },
    { href: "/me", pair: translatePair("nav.me") },
    { href: "/merchant", pair: translatePair("nav.merchantPortal") },
    { href: "/admin", pair: translatePair("nav.adminConsole") },
  ];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10">
      <header className="flex flex-col gap-4 text-left">
        <p className="text-sm uppercase tracking-tight text-neutral-500">
          IC Wallet Frontend / IC 월렛 프런트엔드
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          Unified console for users, merchants, and admins.{" "}
          <span className="block text-2xl text-neutral-500 sm:text-3xl">
            사용자·가맹점·관리자를 위한 통합 콘솔입니다.
          </span>
        </h1>
        <p className="max-w-2xl text-base text-neutral-600 sm:text-lg">
          Start implementing the journeys captured in <code>spec.md</code> and
          track progress with <code>TASK.md</code>. This landing page highlights
          the next development focus areas.{" "}
          <span className="block text-neutral-500">
            <code>spec.md</code>의 시나리오와 <code>TASK.md</code> 체크리스트를
            기반으로 다음 개발 단계를 진행하세요.
          </span>
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {[
          {
            title: "Wallet & Assets / 지갑 및 자산",
            steps: [
              "Implement onboarding, wallet dashboard, and network switching.",
              "온보딩·지갑 대시보드·네트워크 전환을 구현합니다.",
            ],
          },
          {
            title: "NFT Marketplace / NFT 마켓",
            steps: [
              "Wire NFT catalog, purchase flow, and redemption tracking.",
              "NFT 카탈로그·구매 플로·사용 내역 추적을 연동합니다.",
            ],
          },
          {
            title: "P2P Escrow / P2P 에스크로",
            steps: [
              "Design buy/sell flows with escrow status indicators.",
              "에스크로 상태 표시가 포함된 매수/매도 플로를 설계합니다.",
            ],
          },
          {
            title: "Mining & EARN / 마이닝 및 EARN",
            steps: [
              "Surface hashpower metrics and staking/lending dashboards.",
              "해시파워 지표와 스테이킹·랜딩 대시보드를 구현합니다.",
            ],
          },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/80"
          >
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {card.title}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              {card.steps.map((line) => (
                <li key={line} className="leading-relaxed">
                  {line}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section aria-labelledby="routing" className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80">
        <h2 id="routing" className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Route Skeleton / 라우트 스켈레톤
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Navigate to the new app shells to extend each flow.{" "}
          <span className="block">
            각 플로우 확장을 위해 새 라우트 쉘로 이동해 보세요.
          </span>
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {routeLinks.map((route) => (
            <li key={route.href}>
              <Link
                className="flex h-full flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:text-white"
                href={route.href}
              >
                <span>{route.pair.en}</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  {route.pair.ko}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-auto rounded-2xl border border-dashed border-neutral-300 p-6 text-sm text-neutral-500 dark:border-neutral-700">
        <p>
          Update this page as modules graduate from scaffolding to production
          readiness.{" "}
          <span className="block">
            모듈이 스캐폴딩에서 프로덕션 준비 단계로 전환될 때 이 페이지를
            갱신하세요.
          </span>
        </p>
      </footer>
    </main>
  );
}
