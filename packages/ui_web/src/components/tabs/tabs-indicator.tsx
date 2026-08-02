'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRTabsIndicatorProps = ComponentProps<typeof BaseTabs.Indicator>;
export const TRTabsIndicator = createComponentPart(
  BaseTabs.Indicator,
  'tr-tabs-indicator',
);
