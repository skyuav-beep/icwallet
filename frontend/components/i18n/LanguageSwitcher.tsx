'use client';

import { useLocaleSwitcher, useI18n } from "../../lib/i18n/provider";

export function LanguageSwitcher() {
  const { locale, switchLocale } = useLocaleSwitcher();
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
      <span className="font-medium">{t("label.language")}</span>
      <button
        type="button"
        onClick={() => switchLocale("ko")}
        className={`rounded-full border px-3 py-1 transition ${
          locale === "ko"
            ? "border-neutral-800 bg-neutral-900 text-white dark:bg-neutral-800"
            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
        }`}
      >
        {t("label.language.korean", "ko")}
      </button>
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={`rounded-full border px-3 py-1 transition ${
          locale === "en"
            ? "border-neutral-800 bg-neutral-900 text-white dark:bg-neutral-800"
            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
        }`}
      >
        {t("label.language.english", "en")}
      </button>
    </div>
  );
}
