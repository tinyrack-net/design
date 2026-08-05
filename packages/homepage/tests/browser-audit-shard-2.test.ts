process.env['TINYRACK_HOMEPAGE_E2E_SHARD'] = '1';

export {};

await Promise.all([
  import('./browser-rendering.test.ts'),
  import('./browser-flutter-preview.test.ts'),
]);
