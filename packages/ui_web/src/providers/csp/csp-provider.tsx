'use client';

import { CSPProvider as BaseCSPProvider } from '@base-ui/react/csp-provider';
import type { ComponentProps } from 'react';

export type TRCSPProviderProps = ComponentProps<typeof BaseCSPProvider>;

export function TRCSPProvider(props: TRCSPProviderProps) {
  return <BaseCSPProvider {...props} />;
}
