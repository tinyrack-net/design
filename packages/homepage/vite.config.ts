import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import config from './docs.config.ts';
import { flutterPreviewPlugin } from './scripts/flutter-preview-plugin.ts';

const { tinyrackDocs } = await import(
  /* @vite-ignore */
  import.meta.resolve('@tinyrack/docs/vite')
);

const flutterPreviewOrigin = process.env['TINYRACK_FLUTTER_PREVIEW_ORIGIN'];

export default defineConfig({
  plugins: [
    ...tinyrackDocs(config, { root: import.meta.dirname }),
    flutterPreviewPlugin({
      ...(flutterPreviewOrigin === undefined ? {} : { origin: flutterPreviewOrigin }),
      previewRoot: resolve(import.meta.dirname, '../ui_flutter/example/build/web'),
    }),
    tailwindcss(),
  ],
});
