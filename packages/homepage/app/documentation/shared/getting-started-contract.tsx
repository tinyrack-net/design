import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import type { BundledLanguage } from 'shiki/bundle/web';

export const gettingStartedContract = {
  install: 'pnpm add @tinyrack/ui react react-dom',
  viteInstall: 'pnpm add -D tailwindcss@^4.3.0 @tailwindcss/vite@^4.3.0',
  vite: `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`,
  styles: `@import "tailwindcss";
@import "@tinyrack/ui/core.css";
@import "@tinyrack/ui/components/button.css";`,
  theme: '<html data-theme="tinyrack-light">',
  button: `import { TRButton } from '@tinyrack/ui/components/button';

export function DeployButton() {
  return <TRButton intent="primary">Deploy changes</TRButton>;
}`,
} as const;

export type GettingStartedSnippet = keyof typeof gettingStartedContract;
export type GettingStartedLocale = 'en' | 'ja' | 'ko';

const localizedButtonSnippets = {
  en: gettingStartedContract.button,
  ja: `import { TRButton } from '@tinyrack/ui/components/button';

export function DeployButton() {
  return <TRButton intent="primary">変更をデプロイ</TRButton>;
}`,
  ko: `import { TRButton } from '@tinyrack/ui/components/button';

export function DeployButton() {
  return <TRButton intent="primary">변경 사항 배포</TRButton>;
}`,
} satisfies Record<GettingStartedLocale, string>;

const languages: Record<GettingStartedSnippet, BundledLanguage> = {
  install: 'shellscript',
  viteInstall: 'shellscript',
  vite: 'ts',
  styles: 'css',
  theme: 'html',
  button: 'tsx',
};

export function getGettingStartedSnippet(
  snippet: GettingStartedSnippet,
  locale: GettingStartedLocale = 'en',
) {
  return snippet === 'button'
    ? localizedButtonSnippets[locale]
    : gettingStartedContract[snippet];
}

export function GettingStartedCode({
  label,
  locale = 'en',
  snippet,
}: {
  label: string;
  locale?: GettingStartedLocale;
  snippet: GettingStartedSnippet;
}) {
  const code = getGettingStartedSnippet(snippet, locale);

  return (
    <TRCodeBlock
      aria-label={label}
      className="m-0 w-full min-w-0 max-w-full"
      code={code}
      language={languages[snippet]}
      tabIndex={0}
    />
  );
}
