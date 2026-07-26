import latin400 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2?url';
import latin700 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2?url';
import japanese400 from '@fontsource/ibm-plex-sans-jp/files/ibm-plex-sans-jp-japanese-400-normal.woff2?url';
import japanese700 from '@fontsource/ibm-plex-sans-jp/files/ibm-plex-sans-jp-japanese-700-normal.woff2?url';
import korean400 from '@fontsource/ibm-plex-sans-kr/files/ibm-plex-sans-kr-korean-400-normal.woff2?url';
import korean700 from '@fontsource/ibm-plex-sans-kr/files/ibm-plex-sans-kr-korean-700-normal.woff2?url';
import { createTinyrackFontPreloadLinks } from '@tinyrack/ui/core';

export const getFontPreloadLinks = (language: string) =>
  createTinyrackFontPreloadLinks(language, {
    japanese: [japanese400, japanese700],
    korean: [korean400, korean700],
    latin: [latin400, latin700],
  });
