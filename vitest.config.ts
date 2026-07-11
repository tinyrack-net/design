import { readdirSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
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

export default defineConfig(({ mode }) => {
  const componentCoverage = mode === 'component-coverage';

  return {
    test: {
      coverage: {
        provider: 'v8',
        include: componentCoverage
          ? ['src/components/**/*.{ts,tsx}']
          : ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.browser.test.tsx'],
        reporter: componentCoverage
          ? ['text', 'html', 'lcov', 'json-summary']
          : ['text', 'html', 'lcov'],
        thresholds: componentCoverage
          ? {
              ...strictCoverageThresholds,
              ...componentCoverageThresholds,
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
            exclude: ['src/**/*.browser.test.tsx'],
          },
        },
        {
          test: {
            name: 'e2e',
            environment: 'node',
            setupFiles: ['./vitest.setup.ts'],
            include: ['e2e/**/*.test.ts'],
            exclude: ['e2e/storybook-docs-browser.test.ts'],
          },
        },
        {
          test: {
            name: 'storybook-docs',
            environment: 'node',
            setupFiles: ['./vitest.setup.ts'],
            include: ['e2e/storybook-docs-browser.test.ts'],
            hookTimeout: 30_000,
            testTimeout: 180_000,
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
              api: {
                host: '127.0.0.1',
                port: 61080,
              },
              instances: componentCoverage
                ? [{ browser: 'chromium' }]
                : [{ browser: 'chromium' }, { browser: 'firefox' }],
            },
          },
        },
      ],
    },
  };
});
