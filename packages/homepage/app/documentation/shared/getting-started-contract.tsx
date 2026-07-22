import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import type { BundledLanguage } from 'shiki/bundle/web';

export const gettingStartedContract = {
  install: 'pnpm add @tinyrack/ui tailwindcss react react-dom',
  viteInstall: 'pnpm add -D @tailwindcss/vite @vitejs/plugin-react vite',
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

const languages: Record<GettingStartedSnippet, BundledLanguage> = {
  install: 'shellscript',
  viteInstall: 'shellscript',
  vite: 'ts',
  styles: 'css',
  theme: 'html',
  button: 'tsx',
};

export function GettingStartedCode({
  label,
  snippet,
}: {
  label: string;
  snippet: GettingStartedSnippet;
}) {
  return (
    <TRCodeBlock
      aria-label={label}
      className="m-0 w-full min-w-0 max-w-full"
      code={gettingStartedContract[snippet]}
      language={languages[snippet]}
      tabIndex={0}
    />
  );
}
