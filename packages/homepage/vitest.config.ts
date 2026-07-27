import { defineConfig } from 'vitest/config';

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
            'tests/getting-started-contract.test.ts',
            'tests/integration-docs-contract.test.ts',
            'tests/logo.test.ts',
            'tests/tailwind-token-catalog.test.ts',
            'tests/welcome-motion.test.ts',
          ],
        },
      },
      {
        test: {
          name: 'e2e',
          environment: 'node',
          hookTimeout: 30_000,
          include: ['tests/**/*.test.ts'],
          exclude: [
            'tests/app-icons.test.ts',
            'tests/browser-overlays.test.ts',
            'tests/closure-00-29.test.ts',
            'tests/code-block-languages.test.ts',
            'tests/dev-worktree-port.test.ts',
            'tests/integration-docs-contract.test.ts',
            'tests/logo.test.ts',
            'tests/tailwind-token-catalog.test.ts',
            'tests/welcome-motion.test.ts',
          ],
          testTimeout: 120_000,
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
