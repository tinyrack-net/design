import { defineConfig } from 'vitest/config';
import { resolveVisualParityConcurrency } from './scripts/visual-parity-concurrency.ts';

const visualParityConcurrency = resolveVisualParityConcurrency();

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: [
            'tests/app-icons.test.ts',
            'tests/closure-00-29.test.ts',
            'tests/code-block-languages.test.ts',
            'tests/dev-worktree-port.test.ts',
            'tests/flutter-examples.test.ts',
            'tests/flutter-code-block.test.ts',
            'tests/flutter-preview-proxy.test.ts',
            'tests/logo.test.ts',
            'tests/managed-process.test.ts',
            'tests/tailwind-token-catalog.test.ts',
            'tests/visual-parity-concurrency.test.ts',
            'tests/welcome-motion.test.ts',
          ],
        },
      },
      {
        test: {
          name: 'e2e',
          environment: 'node',
          hookTimeout: 30_000,
          maxConcurrency: visualParityConcurrency,
          include: ['tests/**/*.test.ts'],
          exclude: [
            'tests/app-icons.test.ts',
            'tests/browser-flutter-preview.test.ts',
            'tests/browser-overlays.test.ts',
            'tests/browser-rendering.test.ts',
            'tests/closure-00-29.test.ts',
            'tests/code-block-languages.test.ts',
            'tests/dev-worktree-port.test.ts',
            'tests/browser-flutter-preview-dev.test.ts',
            'tests/flutter-examples.test.ts',
            'tests/flutter-code-block.test.ts',
            'tests/flutter-preview-proxy.test.ts',
            'tests/logo.test.ts',
            'tests/tailwind-token-catalog.test.ts',
            'tests/visual-parity-concurrency.test.ts',
            'tests/welcome-motion.test.ts',
          ],
          testTimeout: 120_000,
        },
      },
      {
        test: {
          name: 'e2e-flutter-dev',
          environment: 'node',
          hookTimeout: 180_000,
          include: ['tests/browser-flutter-preview-dev.test.ts'],
          testTimeout: 180_000,
        },
      },
      {
        test: {
          name: 'e2e-overlays',
          environment: 'node',
          hookTimeout: 30_000,
          include: ['tests/browser-overlays.test.ts'],
          testTimeout: 120_000,
        },
      },
    ],
  },
});
