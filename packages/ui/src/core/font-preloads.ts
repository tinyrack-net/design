export type TinyrackFontPreload = {
  as: 'font';
  crossOrigin: 'anonymous';
  href: string;
  rel: 'preload';
  type: 'font/woff2';
};

export type TinyrackFontPreloadFiles = {
  japanese?: readonly string[];
  korean?: readonly string[];
  latin: readonly string[];
};

function fontPreload(href: string): TinyrackFontPreload {
  return {
    as: 'font',
    crossOrigin: 'anonymous',
    href,
    rel: 'preload',
    type: 'font/woff2',
  };
}

export function createTinyrackFontPreloadLinks(
  language: string,
  files: TinyrackFontPreloadFiles,
): TinyrackFontPreload[] {
  const links = files.latin.map(fontPreload);
  const normalizedLanguage = language.toLowerCase();

  if (normalizedLanguage.startsWith('ko')) {
    links.push(...(files.korean ?? []).map(fontPreload));
  }

  if (normalizedLanguage.startsWith('ja')) {
    links.push(...(files.japanese ?? []).map(fontPreload));
  }

  return links;
}
