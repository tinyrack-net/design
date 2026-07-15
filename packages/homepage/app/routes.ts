import { resolve } from 'node:path';
import config from '../docs.config.ts';

const { createDocsRoutes } = (await import(
  /* @vite-ignore */
  import.meta.resolve('@tinyrack/docs/react-router')
)) as typeof import('@tinyrack/docs/react-router');

export default createDocsRoutes(config, { root: resolve(import.meta.dirname, '..') });
