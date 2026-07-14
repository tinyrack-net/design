import { AccordionHeader } from './accordion-header.js';
import { AccordionItem } from './accordion-item.js';
import { AccordionPanel } from './accordion-panel.js';
import { AccordionRoot } from './accordion-root.js';
import { AccordionTrigger } from './accordion-trigger.js';

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
} as const;

export type {
  AccordionHeaderState,
  AccordionItemState,
  AccordionPanelState,
  AccordionRootState,
  AccordionTriggerState,
} from '@base-ui/react/accordion';
export type { AccordionHeaderProps } from './accordion-header.js';
export type { AccordionItemProps } from './accordion-item.js';
export type { AccordionPanelProps } from './accordion-panel.js';
export type { AccordionRootProps } from './accordion-root.js';
export type { AccordionTriggerProps } from './accordion-trigger.js';
export {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
};
