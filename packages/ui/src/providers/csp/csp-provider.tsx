'use client';

import { CSPProvider as BaseCSPProvider } from '@base-ui/react/csp-provider';
import type { ComponentProps } from 'react';

export type CSPProviderProps = ComponentProps<typeof BaseCSPProvider>;

export function CSPProvider(props: CSPProviderProps) {
  return <BaseCSPProvider {...props} />;
}
