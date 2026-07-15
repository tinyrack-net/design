import config from './docs.config.ts';

const { createDocsRouterConfig } = (await import(
  /* @vite-ignore */
  import.meta.resolve('@tinyrack/docs/react-router')
)) as typeof import('@tinyrack/docs/react-router');

export default createDocsRouterConfig(config);
