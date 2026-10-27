export const LANGS = ['hu', 'sl', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export type Localized = Record<Lang, string>;

const STORAGE_KEY = 'muraba-map-lang';

const UI = {
  close: { hu: 'Bezárás', sl: 'Zapri', en: 'Close' },
  touchHint: {
    hu: 'Koppintson a térkép használatához',
    sl: 'Tapnite za uporabo zemljevida',
    en: 'Tap to use the map',
  },
  links: { hu: 'Hivatkozások', sl: 'Povezave', en: 'Links' },
} satisfies Record<string, Localized>;

export type UiKey = keyof typeof UI;

function isLang(value: string | null | undefined): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value);
}

// Priority: ?lang= (set by the WordPress iframe) → saved choice → browser language → English.
export function detectLang(): Lang {
  const param = new URLSearchParams(location.search).get('lang');
  if (isLang(param)) return param;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // Storage can be blocked inside third-party iframes.
  }
  for (const l of navigator.languages ?? [navigator.language]) {
    const code = l.slice(0, 2).toLowerCase();
    if (code === 'sl') return 'sl';
    if (code === 'hu') return 'hu';
    if (code === 'en') return 'en';
  }
  return 'en';
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore: the choice just won't persist.
  }
}

export function t(key: UiKey, lang: Lang): string {
  return UI[key][lang];
}
