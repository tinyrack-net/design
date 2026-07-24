import { defineConfig } from 'tsdown';

const entry = {
  'config/index': 'src/config/index.ts',
  'react-router/index': 'src/react-router/index.ts',
  'runtime/index': 'src/runtime/index.ts',
  'vite/index': 'src/vite/index.ts',
  'highlighting/docs-highlighter': 'src/highlighting/docs-highlighter.ts',
} as const;

const copy = [
  { from: 'src/styles/styles.css', to: 'dist/styles' },
  { from: 'src/styles/callout.css', to: 'dist/styles' },
  {
    from: 'src/runtime/color-scheme-toggle/color-scheme-toggle.css',
    to: 'dist/runtime/color-scheme-toggle',
  },
  {
    from: 'src/runtime/docs-navigation/docs-navigation.css',
    to: 'dist/runtime/docs-navigation',
  },
  {
    from: 'src/runtime/docs-search/docs-search.css',
    to: 'dist/runtime/docs-search',
  },
  {
    from: 'src/runtime/document-pagination/document-pagination.css',
    to: 'dist/runtime/document-pagination',
  },
  {
    from: 'src/runtime/language-select/language-select.css',
    to: 'dist/runtime/language-select',
  },
  {
    from: 'src/runtime/table-of-contents/table-of-contents.css',
    to: 'dist/runtime/table-of-contents',
  },
] as const;

export default defineConfig({
  entry,
  format: 'esm',
  dts: { sourcemap: true },
  clean: true,
  fixedExtension: false,
  platform: 'neutral',
  unbundle: true,
  treeshake: true,
  sourcemap: true,
  tsconfig: './tsconfig.build.json',
  copy: [...copy],
  onSuccess: 'tsc -p tsconfig.test.json --noEmit',
});
