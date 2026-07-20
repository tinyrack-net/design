'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRTabsTabProps = ComponentProps<typeof BaseTabs.Tab>;
export const TRTabsTab = createComponentPart(BaseTabs.Tab, 'tr-tabs-tab');
