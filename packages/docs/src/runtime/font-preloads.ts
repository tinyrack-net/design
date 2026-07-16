import latin400 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2?url';
import latin700 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2?url';
import japanese400 from '@fontsource/ibm-plex-sans-jp/files/ibm-plex-sans-jp-japanese-400-normal.woff2?url';
import japanese700 from '@fontsource/ibm-plex-sans-jp/files/ibm-plex-sans-jp-japanese-700-normal.woff2?url';
import korean400 from '@fontsource/ibm-plex-sans-kr/files/ibm-plex-sans-kr-korean-400-normal.woff2?url';
import korean700 from '@fontsource/ibm-plex-sans-kr/files/ibm-plex-sans-kr-korean-700-normal.woff2?url';

type FontPreload = {
  as: 'font';
  crossOrigin: 'anonymous';
  href: string;
  rel: 'preload';
  type: 'font/woff2';
};

const fontPreload = (href: string): FontPreload => ({
  as: 'font',
  crossOrigin: 'anonymous',
  href,
  rel: 'preload',
  type: 'font/woff2',
});

export function getFontPreloadLinks(language: string): FontPreload[] {
  const links = [fontPreload(latin400), fontPreload(latin700)];

  if (language.toLowerCase().startsWith('ko')) {
    links.push(fontPreload(korean400), fontPreload(korean700));
  }

  if (language.toLowerCase().startsWith('ja')) {
    links.push(fontPreload(japanese400), fontPreload(japanese700));
  }

  return links;
}
