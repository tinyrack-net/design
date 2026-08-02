import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { build } from 'vite';

const flutterPreviewSource = resolve(
  import.meta.dirname,
  '../../ui_flutter/example/build/web',
);
const flutterPreviewTarget = resolve(
  import.meta.dirname,
  '../build/client/flutter-preview',
);
await mkdir(flutterPreviewTarget, { recursive: true });
await cp(flutterPreviewSource, flutterPreviewTarget, {
  force: true,
  recursive: true,
});

await build({
  base: '/__visual-parity/',
  build: {
    emptyOutDir: false,
    outDir: resolve(import.meta.dirname, '../build/client/__visual-parity'),
  },
  plugins: [react()],
  root: resolve(import.meta.dirname, '../tests/visual-parity-fixture'),
});
