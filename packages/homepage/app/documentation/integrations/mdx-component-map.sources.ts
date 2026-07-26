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

const englishMdxSampleSource = `# MDX element coverage

Use the [Tinyrack UI documentation](/en/) to confirm the component contract before release. This sample intentionally exercises every CommonMark and GFM element in the Tinyrack component map.

## Release overview

This paragraph contains **strong text**, *emphasized text*, ~~deprecated text~~, and inline \`data-theme\` code. It also includes a [documentation link](/en/) and a footnote reference.[^1]

- [x] Import the shared styles
- [ ] Verify keyboard behavior

### Review the content structure

Line one\\
Line two after a hard break.

> Blockquotes can contain **strong text**, *emphasis*, ~~deletions~~, and a [link](/en/).
>
> - A nested item uses inline \`code\` without losing its list indentation.
> - Another item keeps related content together.
>
>   > A nested quote tests the spacing between quote borders and list content.
>   >
>   > The second line stays readable after a hard break.\\
>   > The continuation remains inside the nested quote.
>
> \`\`\`tsx
> const status = 'ready';
> \`\`\`
>
> ![Tinyrack mark](/brand/tinyrack-mark.svg)

#### Validate the visual rhythm

Use the unordered list below to check the spacing between related controls:

- Navigation remains easy to scan.
- Related content stays grouped.

| Check | Result | Details |
| --- | --- | --- |
| **Component map** | *Ready* | Inline \`code\` and a [link](/en/) stay inside the cell. |
| ~~Legacy path~~ | Blocked | This intentionally long cell checks wrapping without page overflow. |

##### Compare rendered output

1. Read the heading and its supporting content together.
2. Check that the next section begins after a clear, not excessive, gap.

---

###### Verify the generated output

\`\`\`tsx
export function ReleaseStatus() {
  return <p>Ready to release</p>;
}
\`\`\`

[^1]: Footnotes contain **strong text**, a [back-reference target](/en/), and inline \`code\`.
`;

const koreanMdxSampleSource = `# MDX 요소 전체 보기

릴리스 전에 [Tinyrack UI 문서](/ko/)에서 컴포넌트 규약을 확인하세요. 이 샘플은 Tinyrack 컴포넌트 맵이 지원하는 CommonMark와 GFM 요소를 모두 사용해요.

## 릴리스 개요

이 문단에는 **굵은 텍스트**, *기울임 텍스트*, ~~더 이상 사용하지 않는 텍스트~~, 인라인 \`data-theme\` 코드가 있어요. [문서 링크](/ko/)와 각주 참조도 포함해요.[^1]

- [x] 공유 스타일 불러오기
- [ ] 키보드 동작 확인하기

### 콘텐츠 구조 검토

첫 번째 줄\\
강제 줄바꿈 뒤의 두 번째 줄이에요.

> 인용문 안에는 **굵은 텍스트**, *기울임*, ~~취소선~~, [링크](/ko/)를 함께 넣을 수 있어요.
>
> - 중첩 항목에서도 인라인 \`코드\`와 목록 들여쓰기가 유지돼요.
> - 또 다른 항목이 관련 콘텐츠를 하나로 묶어요.
>
>   > 중첩 인용문은 인용선과 목록 콘텐츠 사이의 간격을 확인하는 데 사용해요.
>   >
>   > 강제 줄바꿈 뒤에도 두 번째 줄이 읽기 쉬워야 해요.\\
>   > 이어지는 줄도 중첩 인용문 안에 남아야 해요.
>
> \`\`\`tsx
> const status = 'ready';
> \`\`\`
>
> ![Tinyrack 마크](/brand/tinyrack-mark.svg)

#### 시각적 리듬 확인

관련 컨트롤 사이의 간격을 확인할 때는 아래 순서 없는 목록을 살펴보세요.

- 탐색 항목을 빠르게 훑을 수 있어요.
- 관련 콘텐츠가 하나의 그룹으로 보여요.

| 확인 항목 | 결과 | 세부 정보 |
| --- | --- | --- |
| **컴포넌트 맵** | *준비됨* | 셀 안에서도 인라인 \`코드\`와 [링크](/ko/)를 유지해요. |
| ~~이전 경로~~ | 차단됨 | 페이지 overflow 없이 긴 셀의 줄바꿈을 확인해요. |

##### 렌더링 결과 비교

1. 제목과 제목을 설명하는 콘텐츠를 함께 읽어 보세요.
2. 다음 섹션이 지나치게 멀지 않으면서도 구분되는지 확인하세요.

---

###### 생성된 출력 확인

\`\`\`tsx
export function ReleaseStatus() {
  return <p>릴리스 준비 완료</p>;
}
\`\`\`

[^1]: 각주에도 **굵은 텍스트**, [뒤로 가기 대상](/ko/), 인라인 \`코드\`를 넣을 수 있어요.
`;

const japaneseMdxSampleSource = `# MDX 要素の網羅例

リリース前に [Tinyrack UI ドキュメント](/ja/) でコンポーネントの仕様を確認してください。このサンプルでは、Tinyrack のコンポーネントマップが対応する CommonMark と GFM の要素をすべて使用します。

## リリースの概要

この段落には **強調文字**、*斜体*、~~非推奨の文字~~、インラインの \`data-theme\` コードが含まれます。[ドキュメントへのリンク](/ja/) と脚注参照も確認できます。[^1]

- [x] 共通スタイルを読み込む
- [ ] キーボード操作を確認する

### コンテンツ構造を確認する

1 行目\\
ハードブレーク後の 2 行目です。

> 引用には **強調文字**、*斜体*、~~取り消し線~~、[リンク](/ja/)を含められます。
>
> - 入れ子の項目でもインラインの \`コード\` とリストのインデントが維持されます。
> - もう一つの項目で関連するコンテンツをまとめます。
>
>   > 入れ子の引用は、引用線とリストのコンテンツの間隔を確認します。
>   >
>   > ハードブレーク後も 2 行目を読みやすく保ちます。\\
>   > 続く行も入れ子の引用内に残ります。
>
> \`\`\`tsx
> const status = 'ready';
> \`\`\`
>
> ![Tinyrack マーク](/brand/tinyrack-mark.svg)

#### 視覚的なリズムを確認する

関連するコントロール間の間隔は、次の順序なしリストで確認できます。

- ナビゲーションを簡単に見渡せます。
- 関連するコンテンツがまとまって表示されます。

| 確認項目 | 結果 | 詳細 |
| --- | --- | --- |
| **コンポーネントマップ** | *準備完了* | セル内でもインラインの \`コード\` と [リンク](/ja/) を維持します。 |
| ~~以前のパス~~ | ブロック | ページを横スクロールさせず、長いセルの折り返しを確認します。 |

##### レンダリング結果を比較する

1. 見出しと、それを説明するコンテンツを一緒に読んでください。
2. 次のセクションが離れすぎず、明確に区切られているか確認してください。

---

###### 生成された出力を確認する

\`\`\`tsx
export function ReleaseStatus() {
  return <p>リリース準備完了</p>;
}
\`\`\`

[^1]: 脚注にも **強調文字**、[戻り先](/ja/)、インラインの \`コード\` を含められます。
`;

export const mdxSampleSources = {
  en: englishMdxSampleSource,
  ja: japaneseMdxSampleSource,
  ko: koreanMdxSampleSource,
} as const;

export const mdxSampleSource = mdxSampleSources.en;
