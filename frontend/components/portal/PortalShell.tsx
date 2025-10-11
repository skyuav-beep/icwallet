'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import {
  usePortalContext,
  usePortalSections,
} from "../../lib/portal/portal-store";

interface PortalShellProps {
  title: string;
  titleKr: string;
  description: string;
  descriptionKr: string;
  children: ReactNode;
}

export function PortalShell({
  title,
  titleKr,
  description,
  descriptionKr,
  children,
}: PortalShellProps) {
  const pathname = usePathname();
  const { role } = usePortalContext();
  const { sections, activeSection, setActiveSection } = usePortalSections();

  useEffect(() => {
    const current = sections.find((section) =>
      pathname.startsWith(section.href),
    );
    setActiveSection(current ? current.id : null);
  }, [pathname, sections, setActiveSection]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
            {role === "merchant"
              ? "Merchant Portal / 가맹점 포털"
              : "Admin Console / 관리자 콘솔"}
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {title}
            <span className="mt-1 block text-xl font-normal text-neutral-500 dark:text-neutral-400">
              {titleKr}
            </span>
          </h1>
          <p className="max-w-3xl text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">
            {description}
            <span className="block">{descriptionKr}</span>
          </p>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:px-10 lg:flex-row">
        <aside className="w-full max-w-xs lg:sticky lg:top-20 lg:w-64">
          <nav
            aria-label="Portal Sections"
            className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80"
          >
            {sections.map((section) => {
              const isActive = section.id === activeSection;
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className={`group rounded-xl border px-4 py-3 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:border-neutral-800 ${
                    isActive
                      ? "border-neutral-800 bg-neutral-900 text-white shadow-sm dark:bg-neutral-800"
                      : "border-neutral-200 bg-white text-neutral-700 hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-700"
                  }`}
                >
                  <span className="flex items-center justify-between font-medium">
                    {section.label}
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      {section.labelKr}
                    </span>
                  </span>
                  {(section.description || section.descriptionKr) && (
                    <span className="mt-2 block text-xs text-neutral-500 dark:text-neutral-400">
                      {section.description}
                      <span className="block">{section.descriptionKr}</span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>
        <section className="flex-1 space-y-8 rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90">
          {children}
        </section>
      </div>
    </div>
  );
}
