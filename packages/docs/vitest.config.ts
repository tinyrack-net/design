import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@tinyrack/ui/components/document-pagination': fileURLToPath(
        new URL('../ui/src/components/document-pagination/index.tsx', import.meta.url),
      ),
      'virtual:tinyrack-docs/manifest': fileURLToPath(
        new URL('./tests/virtual-manifest.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
