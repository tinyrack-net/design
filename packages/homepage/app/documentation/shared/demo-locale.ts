'use client';

import { useLocation } from 'react-router';

export type DemoLocale = 'en' | 'ja' | 'ko';

const supportedLocales = new Set<DemoLocale>(['en', 'ja', 'ko']);

export const demoCopy = {
  en: {
    controls: 'Controls',
    copySource: (label: string, title: string) => `Copy ${label} source for ${title}`,
    example: (title: string) => `${title} example`,
    exampleTabs: (title: string) => `${title} example tabs`,
    invalidJson: 'Enter valid JSON.',
    permalink: 'permalink',
    playground: (title: string) => `${title} playground`,
    preview: 'Preview',
    previewLabel: (title: string) => `${title} preview`,
    reset: 'Reset',
    scrollHint: 'Scroll inside the code area to read long lines.',
    sourceLabel: (label: string, title: string) => `${label} source for ${title}`,
  },
  ja: {
    controls: 'コントロール',
    copySource: (label: string, title: string) => `${title}の${label}ソースをコピー`,
    example: (title: string) => `${title}の例`,
    exampleTabs: (title: string) => `${title}の例のタブ`,
    invalidJson: '有効な JSON を入力してください。',
    permalink: 'パーマリンク',
    playground: (title: string) => `${title}のプレイグラウンド`,
    preview: 'プレビュー',
    previewLabel: (title: string) => `${title}のプレビュー`,
    reset: 'リセット',
    scrollHint: '長い行はコード領域を横にスクロールして確認できます。',
    sourceLabel: (label: string, title: string) => `${title}の${label}ソース`,
  },
  ko: {
    controls: '컨트롤',
    copySource: (label: string, title: string) => `${title}의 ${label} 소스 복사`,
    example: (title: string) => `${title} 예시`,
    exampleTabs: (title: string) => `${title} 예시 탭`,
    invalidJson: '올바른 JSON을 입력하세요.',
    permalink: '고유 링크',
    playground: (title: string) => `${title} 플레이그라운드`,
    preview: '미리보기',
    previewLabel: (title: string) => `${title} 미리보기`,
    reset: '초기화',
    scrollHint: '긴 줄은 코드 영역 안에서 가로로 스크롤해 확인하세요.',
    sourceLabel: (label: string, title: string) => `${title}의 ${label} 소스`,
  },
} as const;

export function useDemoLocale(): DemoLocale {
  const { pathname } = useLocation();
  const locale = pathname.split('/').filter(Boolean)[0];

  return supportedLocales.has(locale as DemoLocale) ? (locale as DemoLocale) : 'en';
}
