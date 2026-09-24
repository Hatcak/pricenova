"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { DEFAULT_LANG, type Lang, type L, pick } from "@/lib/i18n/config";
import { ui, type UIDict } from "@/lib/i18n/dict";

/**
 * The remembered language lives in a tiny external store rather than in state
 * copied out of localStorage by an effect.
 *
 * The server can't see localStorage, so the first paint has to be
 * DEFAULT_LANG either way. useSyncExternalStore is built for exactly that:
 * React hydrates with `getServerSnapshot`, then immediately re-renders with
 * the real value — no cascading render, no hydration warning, and no visible
 * flash of the wrong language.
 */
const STORAGE_KEY = "lang";
const listeners = new Set<() => void>();

/** Cached so getSnapshot stays cheap and returns a stable value. */
let cached: Lang | null = null;

function readStored(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "tr" || saved === "en" ? saved : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG; // private mode or blocked storage
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Lang {
  if (cached === null) cached = readStored();
  return cached;
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG;
}

function writeLang(next: Lang) {
  cached = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* the choice just won't survive a reload */
  }
  document.documentElement.lang = next;
  for (const fn of listeners) fn();
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Shared UI dictionary for the active language. */
  ui: UIDict;
  /** Resolve a translatable { tr, en } value to the active language. */
  t: (value: L) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /** Keep <html lang> honest for screen readers and translation tools. */
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => writeLang(l), []);

  const toggle = useCallback(
    () => setLang(lang === "tr" ? "en" : "tr"),
    [lang, setLang],
  );

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      toggle,
      ui: ui[lang],
      t: (v: L) => pick(v, lang),
    }),
    [lang, setLang, toggle],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
