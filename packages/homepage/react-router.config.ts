import type { Config } from '@react-router/dev/config';

export default {
  prerender: true,
  routeDiscovery: { mode: 'initial' },
  ssr: false,
} satisfies Config;
