import { readdirSync } from 'node:fs';
import { type AddressInfo, createServer } from 'node:net';
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

async function availablePort() {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = (server.address() as AddressInfo).port;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error === undefined ? resolve() : reject(error)));
  });
  return port;
}

export default async function config({ mode }: ConfigEnv) {
  const componentCoverage = mode === 'component-coverage';
  const componentFirefox = mode === 'component-firefox';

  return defineConfig({
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
                port: await availablePort(),
              },
              instances: componentFirefox
                ? [{ browser: 'firefox' }]
                : [{ browser: 'chromium' }],
            },
            // Firefox only, and a mask rather than a fix. Two focus-dependent
            // tests still lose focus under full-suite load in headless Firefox
            // and fail about one run in three:
            //   field.browser.test.tsx 'forwards every host ref ...'
            //   link-button.browser.test.tsx 'preserves native attributes ...'
            // Both pass in isolation, so the trigger is load rather than the
            // assertions. Chromium is clean without any retry. Remove this once
            // those two hold under load.
            retry: componentFirefox ? 1 : 0,
          },
        },
      ],
    },
  });
}
