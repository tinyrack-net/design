'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRTabsUiSize = 'sm' | 'md' | 'lg';
export type TRTabsRootProps = ComponentProps<typeof BaseTabs.Root> & {
  uiSize?: TRTabsUiSize;
};

export function TRTabsRoot({ className, uiSize = 'md', ...props }: TRTabsRootProps) {
  return (
    <BaseTabs.Root
      {...props}
      className={mergeComponentClassName('tr-tabs', className)}
      data-ui-size={uiSize}
    />
  );
}
