process.env['TINYRACK_HOMEPAGE_E2E_SHARD'] = '0';

export {};

await Promise.all([
  import('./browser-rendering.test.ts'),
  import('./browser-flutter-preview.test.ts'),
]);
