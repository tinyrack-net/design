import { TabsIndicator } from './tabs-indicator.js';
import { TabsList } from './tabs-list.js';
import { TabsPanel } from './tabs-panel.js';
import { TabsRoot } from './tabs-root.js';
import { TabsTab } from './tabs-tab.js';

export const Tabs = {
  Root: TabsRoot,
  Tab: TabsTab,
  Indicator: TabsIndicator,
  Panel: TabsPanel,
  List: TabsList,
} as const;

export type {
  TabsIndicatorState,
  TabsListState,
  TabsPanelState,
  TabsRootState,
  TabsTabState,
} from '@base-ui/react/tabs';
export type { TabsIndicatorProps } from './tabs-indicator.js';
export type { TabsListProps } from './tabs-list.js';
export type { TabsPanelProps } from './tabs-panel.js';
export type { TabsRootProps, TabsSize } from './tabs-root.js';
export type { TabsTabProps } from './tabs-tab.js';
export { TabsIndicator, TabsList, TabsPanel, TabsRoot, TabsTab };
