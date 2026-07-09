import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [mdx()],
  srcDir: './e2e/fixtures/astro-mdx/src',
});
