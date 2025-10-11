'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  defaultMessages,
  MessageCatalog,
  MessagePair,
  Locale,
} from "./messages";

interface I18nContextValue {
  locale: Locale;
  messages: MessageCatalog;
  setLocale: (locale: Locale) => void;
  t: (key: string, localeOverride?: Locale) => string;
  pair: (key: string) => MessagePair;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLocale = "ko",
  children,
  messages = defaultMessages,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
  messages?: MessageCatalog;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const value = useMemo<I18nContextValue>(() => {
    const resolvePair = (key: string): MessagePair => {
      const fallback: MessagePair = { en: key, ko: key };
      return messages[key] ?? fallback;
    };

    const translate = (key: string, override?: Locale): string => {
      const effectiveLocale = override ?? locale;
      const pair = resolvePair(key);
      return pair[effectiveLocale];
    };

    return {
      locale,
      messages,
      setLocale,
      t: translate,
      pair: resolvePair,
    };
  }, [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("I18n context missing. Wrap your tree with <I18nProvider />.");
  }
  return context;
}

export function useTranslatePair() {
  const { pair } = useI18n();
  return useCallback((key: string) => pair(key), [pair]);
}

export function useLocaleSwitcher() {
  const { locale, setLocale } = useI18n();
  const switchLocale = useCallback(
    (next: Locale) => {
      if (next !== locale) {
        setLocale(next);
      }
    },
    [locale, setLocale],
  );
  return { locale, switchLocale };
}
