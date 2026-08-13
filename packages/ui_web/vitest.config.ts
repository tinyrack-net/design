import { readdirSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import type { ConfigEnv } from 'vite';
import { defineConfig } from 'vitest/config';

const strictCoverageThresholds = {
  branches: 95,
  functions: 95,
  lines: 95,
  statements: 95,
} as const;

const componentCoverageThresholds = Object.fromEntries(
  readdirSync(new URL('./src/components', import.meta.url), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [
      `src/components/${entry.name}/**/*.{ts,tsx}`,
      strictCoverageThresholds,
    ]),
);

export default async function config({ mode }: ConfigEnv) {
  const componentCoverage = mode === 'component-coverage';
  const componentFirefox = mode === 'component-firefox';
  const componentWebkit = mode === 'component-webkit';

  return defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        // Highlighter adapters hold component logic that used to live inside
        // code-block, so they are measured under the same strict thresholds
        // rather than dropping out of the audited surface.
        include: componentCoverage
          ? ['src/components/**/*.{ts,tsx}', 'src/highlighters/**/*.{ts,tsx}']
          : ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.browser.test.tsx'],
        reporter: componentCoverage
          ? ['text', 'html', 'lcov', 'json-summary']
          : ['text', 'html', 'lcov'],
        thresholds: componentCoverage
          ? {
              ...strictCoverageThresholds,
              ...componentCoverageThresholds,
              'src/highlighters/**/*.{ts,tsx}': strictCoverageThresholds,
            }
          : {
              branches: 50,
              functions: 85,
              lines: 85,
              statements: 85,
            },
      },
      projects: [
        {
          test: {
            name: 'unit',
            environment: 'node',
            setupFiles: ['./vitest.setup.ts'],
            include: ['src/**/*.test.ts'],
            exclude: [
              'src/**/*.browser.test.tsx',
              'src/**/*.docs.test.ts',
              'src/components/dialog/dialog-documentation.test.ts',
            ],
          },
        },
        {
          test: {
            name: 'docs-contract',
            environment: 'node',
            setupFiles: ['./vitest.setup.ts'],
            include: [
              'src/**/*.docs.test.ts',
              'src/components/dialog/dialog-documentation.test.ts',
            ],
          },
        },
        {
          plugins: [react(), tailwindcss()],
          test: {
            name: 'browser',
            setupFiles: ['./vitest.setup.ts'],
            include: ['src/**/*.browser.test.tsx'],
            browser: {
              enabled: true,
              provider: playwright(),
              headless: true,
              fileParallelism: !(componentFirefox || componentWebkit),
              // No explicit port. Probing for a free one meant binding it,
              // reading the number, closing, and rebinding later, which leaves
              // a window for anything else to take it. Vite binds once and
              // increments until it succeeds, so there is no window at all.
              api: { host: '127.0.0.1' },
              instances: componentFirefox
                ? [{ browser: 'firefox' }]
                : componentWebkit
                  ? [{ browser: 'webkit' }]
                  : [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  });
}
