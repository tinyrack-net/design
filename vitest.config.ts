import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.browser.test.tsx'],
      reporter: ['text', 'html', 'lcov'],
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
              port: 61080,
            },
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
