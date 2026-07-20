'use client';

import {
  DirectionProvider as BaseDirectionProvider,
  useDirection as useBaseDirection,
} from '@base-ui/react/direction-provider';
import type { ComponentProps } from 'react';

export type TRDirectionProviderProps = ComponentProps<typeof BaseDirectionProvider>;
export type TextDirection = 'ltr' | 'rtl';

export function TRDirectionProvider(props: TRDirectionProviderProps) {
  return <BaseDirectionProvider {...props} />;
}

export function useDirection() {
  return useBaseDirection();
}
