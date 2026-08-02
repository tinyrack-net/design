'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRTabsPanelProps = ComponentProps<typeof BaseTabs.Panel>;
export const TRTabsPanel = createComponentPart(BaseTabs.Panel, 'tr-tabs-panel');
