'use client';

import { TRCode } from '@tinyrack/ui/components/code';
import { TRInput } from '@tinyrack/ui/components/input';
import { TRLink } from '@tinyrack/ui/components/link';
import { TRTable } from '@tinyrack/ui/components/table';
import { useState } from 'react';
import {
  type TailwindTokenGroupId,
  tailwindTokenBridge,
  tailwindTokenGroups,
} from './tailwind-token-catalog.js';

type TailwindReferenceLocale = 'en' | 'ja' | 'ko';

const copy = {
  en: {
    columns: [
      'Tailwind theme variable',
      'Runtime variable / breakpoint value',
      'Example utility',
    ],
    empty: 'No Tailwind token matches this search.',
    guide: 'Read the foundation guide',
    groups: {
      breakpoint: 'Breakpoints',
      color: 'Colors',
      typography: 'Typography',
      spacing: 'Spacing and controls',
      container: 'Containers',
      'border-focus': 'Borders and focus',
      radius: 'Radius',
      shadow: 'Shadows',
      motion: 'Motion',
      opacity: 'Opacity',
      layer: 'Layers',
      scale: 'Scale',
      decoration: 'Text decoration',
    },
    searchLabel: 'Search Tailwind token reference',
    searchPlaceholder: 'Search utilities or CSS variables',
    tableLabel: 'Tailwind token reference',
    scrollHint:
      'On narrow screens, scroll each table horizontally to compare every column.',
  },
  ko: {
    columns: ['Tailwind 테마 변수', '런타임 변수 / 브레이크포인트 값', '유틸리티 예시'],
    empty: '검색 결과가 없어요.',
    guide: '관련 파운데이션 가이드',
    groups: {
      breakpoint: '브레이크포인트',
      color: '색상',
      typography: '타이포그래피',
      spacing: '간격과 컨트롤',
      container: '컨테이너',
      'border-focus': '테두리와 포커스',
      radius: '모서리 반경',
      shadow: '그림자',
      motion: '모션',
      opacity: '투명도',
      layer: '레이어',
      scale: '스케일',
      decoration: '텍스트 장식',
    },
    searchLabel: 'Tailwind 토큰 검색',
    searchPlaceholder: '유틸리티 또는 CSS 변수 검색',
    tableLabel: 'Tailwind 토큰 참고표',
    scrollHint: '좁은 화면에서는 각 표를 가로로 스크롤해 모든 열을 비교할 수 있어요.',
  },
  ja: {
    columns: [
      'Tailwind テーマ変数',
      '実行時変数 / ブレークポイント値',
      'ユーティリティ例',
    ],
    empty: '検索に一致する Tailwind トークンはありません。',
    guide: '関連する基礎ガイド',
    groups: {
      breakpoint: 'ブレークポイント',
      color: 'カラー',
      typography: 'タイポグラフィ',
      spacing: 'スペーシングとコントロール',
      container: 'コンテナ',
      'border-focus': 'ボーダーとフォーカス',
      radius: '角丸',
      shadow: 'シャドウ',
      motion: 'モーション',
      opacity: '不透明度',
      layer: 'レイヤー',
      scale: 'スケール',
      decoration: 'テキスト装飾',
    },
    searchLabel: 'Tailwind トークンを検索',
    searchPlaceholder: 'ユーティリティまたは CSS 変数を検索',
    tableLabel: 'Tailwind トークンリファレンス',
    scrollHint: '狭い画面では各表を横にスクロールすると、すべての列を比較できます。',
  },
} as const satisfies Record<
  TailwindReferenceLocale,
  {
    columns: readonly [string, string, string];
    empty: string;
    guide: string;
    groups: Record<TailwindTokenGroupId, string>;
    searchLabel: string;
    searchPlaceholder: string;
    tableLabel: string;
    scrollHint: string;
  }
>;

function exampleUtility(themeVariable: string) {
  if (themeVariable.startsWith('--breakpoint-')) {
    return `${themeVariable.replace('--breakpoint-', '')}:grid-cols-2`;
  }
  if (themeVariable.startsWith('--text-decoration-thickness-')) {
    return `decoration-${themeVariable.replace('--text-decoration-thickness-', '')}`;
  }
  if (themeVariable.startsWith('--text-underline-offset-')) {
    return `underline-offset-${themeVariable.replace('--text-underline-offset-', '')}`;
  }
  const suffix = themeVariable
    .replace(
      /^--(?:color|font|text|leading|tracking|font-weight|spacing|container)-/,
      '',
    )
    .replace(
      /^--(?:border-width|outline-width|outline-offset|radius|shadow|transition-duration|ease|opacity|z-index|scale|text-decoration-thickness|text-underline-offset)-/,
      '',
    );

  if (themeVariable.startsWith('--color-')) return `bg-${suffix}`;
  if (themeVariable.startsWith('--font-weight-')) return `font-${suffix}`;
  if (themeVariable.startsWith('--font-')) return `font-${suffix}`;
  if (themeVariable.endsWith('--line-height')) {
    return `text-${suffix.replace(/--line-height$/, '')}`;
  }
  if (themeVariable.startsWith('--text-')) return `text-${suffix}`;
  if (themeVariable.startsWith('--leading-')) return `leading-${suffix}`;
  if (themeVariable.startsWith('--tracking-')) return `tracking-${suffix}`;
  if (themeVariable.startsWith('--spacing-')) return `p-${suffix}`;
  if (themeVariable.startsWith('--container-')) return `max-w-${suffix}`;
  if (themeVariable.startsWith('--border-width-')) return `border-${suffix}`;
  if (themeVariable.startsWith('--outline-width-')) return `outline-${suffix}`;
  if (themeVariable.startsWith('--outline-offset-')) return `outline-offset-${suffix}`;
  if (themeVariable.startsWith('--radius-')) return `rounded-${suffix}`;
  if (themeVariable.startsWith('--shadow-')) return `shadow-${suffix}`;
  if (themeVariable.startsWith('--transition-duration-')) return `duration-${suffix}`;
  if (themeVariable.startsWith('--ease-')) return `ease-${suffix}`;
  if (themeVariable.startsWith('--opacity-')) return `opacity-${suffix}`;
  if (themeVariable.startsWith('--z-index-')) return `z-${suffix}`;
  if (themeVariable.startsWith('--scale-')) return `scale-${suffix}`;
  throw new Error(`Unsupported Tailwind theme variable: ${themeVariable}`);
}

function sourceToken(entry: (typeof tailwindTokenBridge)[number]) {
  return entry.group === 'breakpoint' ? entry.value : entry.runtimeVariable;
}

export function TailwindTokenReference({
  locale,
}: {
  locale: TailwindReferenceLocale;
}) {
  const [query, setQuery] = useState('');
  const labels = copy[locale];
  const normalizedQuery = query.trim().toLowerCase();
  const visibleGroups = tailwindTokenGroups.flatMap((group) => {
    const entries = tailwindTokenBridge.filter((entry) => {
      if (entry.group !== group.id) return false;
      if (normalizedQuery.length === 0) return true;
      return [
        entry.themeVariable,
        sourceToken(entry),
        exampleUtility(entry.themeVariable),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
    return entries.length > 0 ? [{ entries, group }] : [];
  });

  return (
    <section className="grid gap-tinyrack-xl" data-tailwind-token-reference="">
      <TRInput
        aria-label={labels.searchLabel}
        className="w-full max-w-tinyrack-measure-md"
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder={labels.searchPlaceholder}
        type="search"
        value={query}
      />
      <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted sm:hidden">
        {labels.scrollHint}
      </p>

      {visibleGroups.length === 0 ? (
        <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted" role="status">
          {labels.empty}
        </p>
      ) : (
        visibleGroups.map(({ entries, group }) => (
          <section
            className="grid min-w-0 gap-tinyrack-md"
            data-tailwind-token-group={group.id}
            id={group.anchor}
            key={group.id}
          >
            <div className="grid gap-tinyrack-xs">
              <h3 className="tr-mdx-h3 m-0">{labels.groups[group.id]}</h3>
              <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">
                <TRCode>{group.utilityPattern}</TRCode>
              </p>
              <TRLink href={`/${locale}/foundations/${group.guide}/`}>
                {labels.guide}
              </TRLink>
            </div>
            <TRTable.Root
              className="min-w-tinyrack-measure-2xl!"
              containerClassName="tr-mdx-table-container"
              containerProps={{
                'aria-label': `${labels.groups[group.id]} ${labels.tableLabel}`,
                tabIndex: 0,
              }}
              data-tailwind-token-table={group.id}
              density="compact"
            >
              <TRTable.Header>
                <TRTable.Row>
                  {labels.columns.map((column) => (
                    <TRTable.Head key={column} scope="col">
                      {column}
                    </TRTable.Head>
                  ))}
                </TRTable.Row>
              </TRTable.Header>
              <TRTable.Body>
                {entries.map((entry) => (
                  <TRTable.Row key={entry.themeVariable}>
                    <TRTable.Head scope="row">
                      <TRCode>{entry.themeVariable}</TRCode>
                    </TRTable.Head>
                    <TRTable.Cell>
                      <TRCode>{sourceToken(entry)}</TRCode>
                    </TRTable.Cell>
                    <TRTable.Cell>
                      <TRCode>{exampleUtility(entry.themeVariable)}</TRCode>
                    </TRTable.Cell>
                  </TRTable.Row>
                ))}
              </TRTable.Body>
            </TRTable.Root>
          </section>
        ))
      )}
    </section>
  );
}
