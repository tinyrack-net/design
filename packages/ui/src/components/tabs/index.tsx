import { TRTabsIndicator } from './tabs-indicator.js';
import { TRTabsList } from './tabs-list.js';
import { TRTabsPanel } from './tabs-panel.js';
import { TRTabsRoot } from './tabs-root.js';
import { TRTabsTab } from './tabs-tab.js';

export const TRTabs = {
  Root: TRTabsRoot,
  Tab: TRTabsTab,
  Indicator: TRTabsIndicator,
  Panel: TRTabsPanel,
  List: TRTabsList,
} as const;

export type {
  TabsIndicatorState as TRTabsIndicatorState,
  TabsListState as TRTabsListState,
  TabsPanelState as TRTabsPanelState,
  TabsRootState as TRTabsRootState,
  TabsTabState as TRTabsTabState,
} from '@base-ui/react/tabs';
export type { TRTabsIndicatorProps } from './tabs-indicator.js';
export type { TRTabsListProps } from './tabs-list.js';
export type { TRTabsPanelProps } from './tabs-panel.js';
export type { TRTabsRootProps, TRTabsUiSize } from './tabs-root.js';
export type { TRTabsTabProps } from './tabs-tab.js';
export { TRTabsIndicator, TRTabsList, TRTabsPanel, TRTabsRoot, TRTabsTab };
