'use client';

import {
  DirectionProvider as BaseDirectionProvider,
  useDirection as useBaseDirection,
} from '@base-ui/react/direction-provider';
import type { ComponentProps } from 'react';

export type DirectionProviderProps = ComponentProps<typeof BaseDirectionProvider>;
export type TextDirection = 'ltr' | 'rtl';

export function DirectionProvider(props: DirectionProviderProps) {
  return <BaseDirectionProvider {...props} />;
}

export function useDirection() {
  return useBaseDirection();
}
