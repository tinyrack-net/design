export const mdxInstallSource = `pnpm add @tinyrack/ui react@^19 react-dom@^19
pnpm add -D @mdx-js/rollup @tailwindcss/vite @types/mdx @vitejs/plugin-react remark-gfm tailwindcss@^4 vite`;

export const mdxViteConfigSource = `import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({ remarkPlugins: [remarkGfm] }),
    },
    react({ include: /\\.(?:js|jsx|ts|tsx|md|mdx)$/ }),
    tailwindcss(),
  ],
});`;

export const mdxCssSource = `@import 'tailwindcss';
@import '@tinyrack/ui/core.css';
@import '@tinyrack/ui/mdx.css';
@import '@tinyrack/ui/components/code.css';
@import '@tinyrack/ui/components/code-block.css';
@import '@tinyrack/ui/components/link.css';
@import '@tinyrack/ui/components/table.css';`;

export const mdxArticleSource = `import Content from './content.mdx';
import { tinyrackMdxComponents } from '@tinyrack/ui/mdx';
import './app.css';

export function MdxArticle() {
  return <Content components={tinyrackMdxComponents} />;
}`;

export const mdxNestedArticleSource = `import type { ComponentPropsWithoutRef } from 'react';
import Content from './content.mdx';
import { createTinyrackMdxComponents } from '@tinyrack/ui/mdx';
import './app.css';

function ArticleWrapper({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'article'>) {
  return (
    <article
      {...props}
      className={['tr-mdx', className].filter(Boolean).join(' ')}
    >
      {children}
    </article>
  );
}

const articleComponents = createTinyrackMdxComponents({
  components: { wrapper: ArticleWrapper },
});

export function ProductPage() {
  return (
    <main>
      <Content components={articleComponents} />
    </main>
  );
}`;

const englishMdxSampleSource = `# Release checklist

Use the [Tinyrack UI documentation](/en/) to confirm the component contract before release.

- [x] Import the shared styles
- [ ] Verify keyboard behavior

The active theme is stored in the inline \`data-theme\` value.

| Check | Result | Verification command |
| --- | --- | --- |
| Component map | Ready | \`pnpm --filter @tinyrack/homepage test:unit\` |
| GFM table | Ready | \`pnpm --filter @tinyrack/ui test:unit\` |

\`\`\`tsx
export function ReleaseStatus() {
  return <p>Ready to release</p>;
}
\`\`\`
`;

const koreanMdxSampleSource = `# 릴리스 확인 목록

릴리스 전에 [Tinyrack UI 문서](/ko/)에서 컴포넌트 계약을 확인하세요.

- [x] 공유 스타일 불러오기
- [ ] 키보드 동작 확인하기

현재 테마는 \`data-theme\` 속성으로 지정해요.

| 확인 항목 | 결과 | 검증 명령 |
| --- | --- | --- |
| 컴포넌트 맵 | 준비됨 | \`pnpm --filter @tinyrack/homepage test:unit\` |
| GFM 표 | 준비됨 | \`pnpm --filter @tinyrack/ui test:unit\` |

\`\`\`tsx
export function ReleaseStatus() {
  return <p>릴리스 준비 완료</p>;
}
\`\`\`
`;

const japaneseMdxSampleSource = `# リリースチェックリスト

リリース前に [Tinyrack UI ドキュメント](/ja/) でコンポーネントのコントラクトを確認してください。

- [x] 共通スタイルを読み込む
- [ ] キーボード操作を確認する

現在のテーマは、\`data-theme\` 属性で指定します。

| 確認項目 | 結果 | 検証コマンド |
| --- | --- | --- |
| コンポーネントマップ | 準備完了 | \`pnpm --filter @tinyrack/homepage test:unit\` |
| GFM の表 | 準備完了 | \`pnpm --filter @tinyrack/ui test:unit\` |

\`\`\`tsx
export function ReleaseStatus() {
  return <p>リリース準備完了</p>;
}
\`\`\`
`;

export const mdxSampleSources = {
  en: englishMdxSampleSource,
  ja: japaneseMdxSampleSource,
  ko: koreanMdxSampleSource,
} as const;

export const mdxSampleSource = mdxSampleSources.en;
