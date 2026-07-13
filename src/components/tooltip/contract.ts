import type { PopoverPlacement } from '../popover/contract.js';

export const tooltipClassName = 'tr-tooltip';
export const tooltipContentClassName = 'tr-tooltip-content';

export const tooltipContract = {
  defaultCloseDelay: 100,
  defaultOpenDelay: 500,
  defaultPlacement: 'top' as PopoverPlacement,
} as const;

export const tooltipOpenChangeEventName = 'tinyrack:tooltip-open-change' as const;

export type TooltipOpenChangeDetail = {
  content: HTMLElement;
  open: boolean;
  trigger: HTMLElement;
};
