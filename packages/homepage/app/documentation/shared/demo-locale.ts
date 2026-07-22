'use client';

import { useLocation } from 'react-router';

export type DemoLocale = 'en' | 'ja' | 'ko';

const supportedLocales = new Set<DemoLocale>(['en', 'ja', 'ko']);

export const demoCopy = {
  en: {
    controls: 'Controls',
    copy: 'Copy',
    copyLabel: (label: string) => `Copy ${label}`,
    copied: 'Copied',
    copyUnavailable: 'Copy unavailable',
    copySource: (label: string, title: string) => `Copy ${label} source for ${title}`,
    example: (title: string) => `${title} example`,
    exampleTabs: (title: string) => `${title} example tabs`,
    invalidJson: 'Enter valid JSON.',
    installCommand: (label: string) => `${label} install command`,
    installationOptions: 'Installation options',
    installationTarget: 'Installation target',
    installationTargets: 'Installation targets',
    permalink: 'permalink',
    playground: (title: string) => `${title} playground`,
    preview: 'Preview',
    previewLabel: (title: string) => `${title} preview`,
    reset: 'Reset',
    scrollHint: 'Scroll inside the code area to read long lines.',
    sourceLabel: (label: string, title: string) => `${label} source for ${title}`,
    usageCode: (label: string) => `${label} usage code`,
  },
  ja: {
    controls: 'コントロール',
    copy: 'コピー',
    copyLabel: (label: string) => `${label}をコピー`,
    copied: 'コピーしました',
    copyUnavailable: 'コピーできません',
    copySource: (label: string, title: string) => `${title}の${label}ソースをコピー`,
    example: (title: string) => `${title}の例`,
    exampleTabs: (title: string) => `${title}の例のタブ`,
    invalidJson: '有効な JSON を入力してください。',
    installCommand: (label: string) => `${label}のインストールコマンド`,
    installationOptions: 'インストール方法',
    installationTarget: 'インストール対象',
    installationTargets: 'インストール対象',
    permalink: 'パーマリンク',
    playground: (title: string) => `${title}のプレイグラウンド`,
    preview: 'プレビュー',
    previewLabel: (title: string) => `${title}のプレビュー`,
    reset: 'リセット',
    scrollHint: '長い行はコード領域を横にスクロールして確認できます。',
    sourceLabel: (label: string, title: string) => `${title}の${label}ソース`,
    usageCode: (label: string) => `${label}の使用コード`,
  },
  ko: {
    controls: '컨트롤',
    copy: '복사',
    copyLabel: (label: string) => `${label} 복사`,
    copied: '복사했어요',
    copyUnavailable: '복사할 수 없어요',
    copySource: (label: string, title: string) => `${title}의 ${label} 소스 복사`,
    example: (title: string) => `${title} 예시`,
    exampleTabs: (title: string) => `${title} 예시 탭`,
    invalidJson: '올바른 JSON을 입력하세요.',
    installCommand: (label: string) => `${label} 설치 명령어`,
    installationOptions: '설치 방법',
    installationTarget: '설치 대상',
    installationTargets: '설치 대상',
    permalink: '고유 링크',
    playground: (title: string) => `${title} 플레이그라운드`,
    preview: '미리보기',
    previewLabel: (title: string) => `${title} 미리보기`,
    reset: '초기화',
    scrollHint: '긴 줄은 코드 영역 안에서 가로로 스크롤해 확인하세요.',
    sourceLabel: (label: string, title: string) => `${title}의 ${label} 소스`,
    usageCode: (label: string) => `${label} 사용 코드`,
  },
} as const;

export function useDemoLocale(): DemoLocale {
  const { pathname } = useLocation();
  const locale = pathname.split('/').filter(Boolean)[0];

  return supportedLocales.has(locale as DemoLocale) ? (locale as DemoLocale) : 'en';
}
