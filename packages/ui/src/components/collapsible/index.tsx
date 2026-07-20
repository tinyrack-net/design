import { TRCollapsiblePanel } from './collapsible-panel.js';
import { TRCollapsibleRoot } from './collapsible-root.js';
import { TRCollapsibleTrigger } from './collapsible-trigger.js';

export const TRCollapsible = {
  Root: TRCollapsibleRoot,
  Trigger: TRCollapsibleTrigger,
  Panel: TRCollapsiblePanel,
} as const;

export type {
  CollapsiblePanelState as TRCollapsiblePanelState,
  CollapsibleRootState as TRCollapsibleRootState,
  CollapsibleTriggerState as TRCollapsibleTriggerState,
} from '@base-ui/react/collapsible';
export type { TRCollapsiblePanelProps } from './collapsible-panel.js';
export type { TRCollapsibleRootProps } from './collapsible-root.js';
export type { TRCollapsibleTriggerProps } from './collapsible-trigger.js';
export { TRCollapsiblePanel, TRCollapsibleRoot, TRCollapsibleTrigger };
