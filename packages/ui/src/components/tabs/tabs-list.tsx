'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TabsListProps = ComponentProps<typeof BaseTabs.List>;
export const TabsList = createComponentPart(BaseTabs.List, 'tr-tabs-list');
