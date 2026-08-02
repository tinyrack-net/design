'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const TINYRACK_COLOR_SCHEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';
export const TINYRACK_COLOR_SCHEME_STORAGE_KEY = 'tinyrack-theme';

export type TinyrackColorSchemePreference = 'auto' | 'dark' | 'light';
export type TinyrackAppliedColorScheme = 'tinyrack-dark' | 'tinyrack-light';

type ColorSchemeStorage = Pick<Storage, 'getItem' | 'setItem'>;

export type TRColorSchemeProviderProps = {
  children?: ReactNode;
  defaultPreference?: TinyrackColorSchemePreference;
  storageKey?: string;
};

type ColorSchemeContextValue = {
  applied: TinyrackAppliedColorScheme;
  preference: TinyrackColorSchemePreference;
  setPreference: (preference: TinyrackColorSchemePreference) => void;
};

const ColorSchemeContext = createContext<ColorSchemeContextValue | undefined>(
  undefined,
);

export function isTinyrackColorSchemePreference(
  value: string | null | undefined,
): value is TinyrackColorSchemePreference {
  return value === 'auto' || value === 'dark' || value === 'light';
}

function normalizeStoredPreference(
  value: string | null | undefined,
): TinyrackColorSchemePreference | undefined {
  if (isTinyrackColorSchemePreference(value)) return value;
  if (value === 'tinyrack-dark') return 'dark';
  if (value === 'tinyrack-light') return 'light';
  return undefined;
}

export function getTinyrackColorSchemePreference(
  storage: Pick<ColorSchemeStorage, 'getItem'> | undefined,
  storageKey = TINYRACK_COLOR_SCHEME_STORAGE_KEY,
  fallback: TinyrackColorSchemePreference = 'auto',
): TinyrackColorSchemePreference {
  try {
    return normalizeStoredPreference(storage?.getItem(storageKey)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function resolveTinyrackColorScheme(
  preference: TinyrackColorSchemePreference,
  prefersDark: boolean,
): TinyrackAppliedColorScheme {
  if (preference === 'auto') {
    return prefersDark ? 'tinyrack-dark' : 'tinyrack-light';
  }
  return preference === 'dark' ? 'tinyrack-dark' : 'tinyrack-light';
}

export function applyTinyrackColorScheme(
  html: HTMLElement,
  preference: TinyrackColorSchemePreference,
  prefersDark: boolean,
): TinyrackAppliedColorScheme {
  const applied = resolveTinyrackColorScheme(preference, prefersDark);
  html.dataset['theme'] = applied;
  html.style.colorScheme = applied === 'tinyrack-dark' ? 'dark' : 'light';
  return applied;
}

type SetupColorSchemeOptions = {
  defaultPreference?: TinyrackColorSchemePreference;
  document?: Document;
  onChange?: (
    preference: TinyrackColorSchemePreference,
    applied: TinyrackAppliedColorScheme,
  ) => void;
  storageKey?: string;
  window?: Window;
};

export function setupTinyrackColorScheme({
  defaultPreference = 'auto',
  document: documentObject = document,
  onChange,
  storageKey = TINYRACK_COLOR_SCHEME_STORAGE_KEY,
  window: windowObject = window,
}: SetupColorSchemeOptions = {}) {
  const media =
    typeof windowObject.matchMedia === 'function'
      ? windowObject.matchMedia(TINYRACK_COLOR_SCHEME_MEDIA_QUERY)
      : undefined;

  const sync = () => {
    const preference = getTinyrackColorSchemePreference(
      windowObject.localStorage,
      storageKey,
      defaultPreference,
    );
    const applied = applyTinyrackColorScheme(
      documentObject.documentElement,
      preference,
      media?.matches ?? false,
    );
    onChange?.(preference, applied);
  };
  const handleMediaChange = () => {
    if (
      getTinyrackColorSchemePreference(
        windowObject.localStorage,
        storageKey,
        defaultPreference,
      ) === 'auto'
    ) {
      sync();
    }
  };

  sync();
  media?.addEventListener('change', handleMediaChange);
  return () => media?.removeEventListener('change', handleMediaChange);
}

export function createTinyrackColorSchemeScript({
  defaultPreference = 'auto',
  storageKey = TINYRACK_COLOR_SCHEME_STORAGE_KEY,
}: Pick<TRColorSchemeProviderProps, 'defaultPreference' | 'storageKey'> = {}): string {
  return `(() => {
  try {
    var stored = localStorage.getItem(${JSON.stringify(storageKey)});
    var preference = stored === "tinyrack-light" ? "light"
      : stored === "tinyrack-dark" ? "dark"
      : stored === "auto" || stored === "light" || stored === "dark"
        ? stored
        : ${JSON.stringify(defaultPreference)};
    var prefersDark = window.matchMedia(${JSON.stringify(TINYRACK_COLOR_SCHEME_MEDIA_QUERY)}).matches;
    var applied = preference === "light" ? "tinyrack-light"
      : preference === "dark" ? "tinyrack-dark"
      : prefersDark ? "tinyrack-dark" : "tinyrack-light";
    document.documentElement.dataset.theme = applied;
    document.documentElement.style.colorScheme = applied === "tinyrack-dark" ? "dark" : "light";
  } catch (error) {}
})();`;
}

export function TRColorSchemeProvider({
  children,
  defaultPreference = 'auto',
  storageKey = TINYRACK_COLOR_SCHEME_STORAGE_KEY,
}: TRColorSchemeProviderProps) {
  const [preference, setPreferenceState] =
    useState<TinyrackColorSchemePreference>(defaultPreference);
  const [applied, setApplied] = useState<TinyrackAppliedColorScheme>(() =>
    resolveTinyrackColorScheme(defaultPreference, false),
  );

  useEffect(
    () =>
      setupTinyrackColorScheme({
        defaultPreference,
        onChange(nextPreference, nextApplied) {
          setPreferenceState(nextPreference);
          setApplied(nextApplied);
        },
        storageKey,
      }),
    [defaultPreference, storageKey],
  );

  const setPreference = useCallback(
    (nextPreference: TinyrackColorSchemePreference) => {
      try {
        window.localStorage.setItem(storageKey, nextPreference);
      } catch {
        // Storage can be unavailable in privacy-restricted contexts. Applying
        // the preference for the current document still provides useful behavior.
      }
      const prefersDark =
        typeof window.matchMedia === 'function' &&
        window.matchMedia(TINYRACK_COLOR_SCHEME_MEDIA_QUERY).matches;
      setPreferenceState(nextPreference);
      setApplied(
        applyTinyrackColorScheme(document.documentElement, nextPreference, prefersDark),
      );
    },
    [storageKey],
  );

  const value = useMemo(
    () => ({ applied, preference, setPreference }),
    [applied, preference, setPreference],
  );

  return (
    <ColorSchemeContext.Provider value={value}>{children}</ColorSchemeContext.Provider>
  );
}

export function useTinyrackColorScheme() {
  const value = useContext(ColorSchemeContext);
  if (value === undefined) {
    throw new Error('useTinyrackColorScheme must be used inside TRColorSchemeProvider');
  }
  return value;
}
