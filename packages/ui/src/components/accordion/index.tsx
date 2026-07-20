import { TRAccordionHeader } from './accordion-header.js';
import { TRAccordionItem } from './accordion-item.js';
import { TRAccordionPanel } from './accordion-panel.js';
import { TRAccordionRoot } from './accordion-root.js';
import { TRAccordionTrigger } from './accordion-trigger.js';

export const TRAccordion = {
  Root: TRAccordionRoot,
  Item: TRAccordionItem,
  Header: TRAccordionHeader,
  Trigger: TRAccordionTrigger,
  Panel: TRAccordionPanel,
} as const;

export type {
  AccordionHeaderState as TRAccordionHeaderState,
  AccordionItemState as TRAccordionItemState,
  AccordionPanelState as TRAccordionPanelState,
  AccordionRootState as TRAccordionRootState,
  AccordionTriggerState as TRAccordionTriggerState,
} from '@base-ui/react/accordion';
export type { TRAccordionHeaderProps } from './accordion-header.js';
export type { TRAccordionItemProps } from './accordion-item.js';
export type { TRAccordionPanelProps } from './accordion-panel.js';
export type { TRAccordionRootProps } from './accordion-root.js';
export type { TRAccordionTriggerProps } from './accordion-trigger.js';
export {
  TRAccordionHeader,
  TRAccordionItem,
  TRAccordionPanel,
  TRAccordionRoot,
  TRAccordionTrigger,
};
