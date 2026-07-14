import { CollapsiblePanel } from './collapsible-panel.js';
import { CollapsibleRoot } from './collapsible-root.js';
import { CollapsibleTrigger } from './collapsible-trigger.js';

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
} as const;

export type {
  CollapsiblePanelState,
  CollapsibleRootState,
  CollapsibleTriggerState,
} from '@base-ui/react/collapsible';
export type { CollapsiblePanelProps } from './collapsible-panel.js';
export type { CollapsibleRootProps } from './collapsible-root.js';
export type { CollapsibleTriggerProps } from './collapsible-trigger.js';
export { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger };
