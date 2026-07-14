import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'vite';
import { homepageSeoPlugin } from './scripts/homepage-seo-plugin.js';

const homepageRoot = fileURLToPath(new URL('.', import.meta.url));
const uiSource = fileURLToPath(new URL('../ui/src/', import.meta.url));
const homepageHighlighter = fileURLToPath(
  new URL('./app/highlighting/homepage-highlighter.ts', import.meta.url),
);

export default defineConfig({
  build: {
    rolldownOptions: {
      checks: { pluginTimings: false },
    },
  },
  plugins: [
    homepageSeoPlugin(homepageRoot),
    {
      enforce: 'pre',
      ...mdx({ providerImportSource: '@mdx-js/react', remarkPlugins: [remarkGfm] }),
    },
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    alias: [
      { find: 'shiki/bundle/web', replacement: homepageHighlighter },
      {
        find: /^@tinyrack\/ui\/components\/([^/]+)\.css$/,
        replacement: `${uiSource}components/$1/$1.css`,
      },
      {
        find: /^@tinyrack\/ui\/components\/([^/]+)$/,
        replacement: `${uiSource}components/$1/index.tsx`,
      },
      {
        find: /^@tinyrack\/ui\/providers\/([^/]+)$/,
        replacement: `${uiSource}providers/$1/index.tsx`,
      },
      { find: '@tinyrack/ui/core.css', replacement: `${uiSource}core/core.css` },
      { find: '@tinyrack/ui/core', replacement: `${uiSource}core/index.ts` },
      { find: '@tinyrack/ui/mdx.css', replacement: `${uiSource}mdx/mdx.css` },
      { find: '@tinyrack/ui/mdx', replacement: `${uiSource}mdx/index.tsx` },
    ],
  },
});
