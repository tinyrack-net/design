'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsRootProps = ComponentProps<typeof BaseTabs.Root> & {
  size?: TabsSize;
};

export function TabsRoot({ className, size = 'md', ...props }: TabsRootProps) {
  return (
    <BaseTabs.Root
      {...props}
      className={mergeComponentClassName('tr-tabs', className)}
      data-size={size}
    />
  );
}
