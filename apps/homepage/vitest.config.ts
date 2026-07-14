import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    hookTimeout: 30_000,
    include: ['tests/**/*.test.ts'],
    testTimeout: 180_000,
  },
});
