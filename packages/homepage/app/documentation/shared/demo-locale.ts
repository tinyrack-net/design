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
    copyStyles: 'Copy styles',
    copyStylesSource: (label: string, title: string) =>
      `Copy ${label} styles for ${title}`,
    example: (title: string) => `${title} example`,
    exampleTabs: (title: string) => `${title} example tabs`,
    imports: 'Imports',
    invalidJson: 'Enter valid JSON.',
    installCommand: (label: string) => `${label} install command`,
    installationOptions: 'Installation options',
    installationTarget: 'Installation target',
    installationTargets: 'Installation targets',
    installImports: (label: string) => `${label} imports`,
    installStyles: (label: string) => `${label} styles`,
    permalink: 'permalink',
    playground: (title: string) => `${title} playground`,
    preview: 'Preview',
    previewLabel: (title: string) => `${title} preview`,
    reset: 'Reset',
    scrollHint: 'Scroll inside the code area to read long lines.',
    sourceLabel: (label: string, title: string) => `${label} source for ${title}`,
    styles: 'Styles',
    stylesSourceLabel: (label: string, title: string) => `${label} styles for ${title}`,
    usageCode: (label: string) => `${label} usage code`,
  },
  ja: {
    controls: 'コントロール',
    copy: 'コピー',
    copyLabel: (label: string) => `${label}をコピー`,
    copied: 'コピーしました',
    copyUnavailable: 'コピーできません',
    copySource: (label: string, title: string) => `${title}の${label}ソースをコピー`,
    copyStyles: 'スタイルをコピー',
    copyStylesSource: (label: string, title: string) =>
      `${title}の${label}スタイルをコピー`,
    example: (title: string) => `${title}の例`,
    exampleTabs: (title: string) => `${title}の例のタブ`,
    imports: 'インポート',
    invalidJson: '有効な JSON を入力してください。',
    installCommand: (label: string) => `${label}のインストールコマンド`,
    installationOptions: 'インストール方法',
    installationTarget: 'インストール対象',
    installationTargets: 'インストール対象',
    installImports: (label: string) => `${label}のインポート`,
    installStyles: (label: string) => `${label}のスタイル`,
    permalink: 'パーマリンク',
    playground: (title: string) => `${title}のプレイグラウンド`,
    preview: 'プレビュー',
    previewLabel: (title: string) => `${title}のプレビュー`,
    reset: 'リセット',
    scrollHint: '長い行はコード領域を横にスクロールして確認できます。',
    sourceLabel: (label: string, title: string) => `${title}の${label}ソース`,
    styles: 'スタイル',
    stylesSourceLabel: (label: string, title: string) => `${title}の${label}スタイル`,
    usageCode: (label: string) => `${label}の使用コード`,
  },
  ko: {
    controls: '컨트롤',
    copy: '복사',
    copyLabel: (label: string) => `${label} 복사`,
    copied: '복사했어요',
    copyUnavailable: '복사할 수 없어요',
    copySource: (label: string, title: string) => `${title}의 ${label} 소스 복사`,
    copyStyles: '스타일 복사',
    copyStylesSource: (label: string, title: string) =>
      `${title}의 ${label} 스타일 복사`,
    example: (title: string) => `${title} 예시`,
    exampleTabs: (title: string) => `${title} 예시 탭`,
    imports: '가져오기',
    invalidJson: '올바른 JSON을 입력하세요.',
    installCommand: (label: string) => `${label} 설치 명령어`,
    installationOptions: '설치 방법',
    installationTarget: '설치 대상',
    installationTargets: '설치 대상',
    installImports: (label: string) => `${label} 가져오기`,
    installStyles: (label: string) => `${label} 스타일`,
    permalink: '고유 링크',
    playground: (title: string) => `${title} 플레이그라운드`,
    preview: '미리보기',
    previewLabel: (title: string) => `${title} 미리보기`,
    reset: '초기화',
    scrollHint: '긴 줄은 코드 영역 안에서 가로로 스크롤해 확인하세요.',
    sourceLabel: (label: string, title: string) => `${title}의 ${label} 소스`,
    styles: '스타일',
    stylesSourceLabel: (label: string, title: string) => `${title}의 ${label} 스타일`,
    usageCode: (label: string) => `${label} 사용 코드`,
  },
} as const;

export function useDemoLocale(): DemoLocale {
  const { pathname } = useLocation();
  const locale = pathname.split('/').filter(Boolean)[0];

  return supportedLocales.has(locale as DemoLocale) ? (locale as DemoLocale) : 'en';
}
