export const accordionClassName = 'tr-accordion';
export const accordionItemClassName = 'tr-accordion-item';
export const accordionSummaryClassName = 'tr-accordion-summary';
export const accordionContentClassName = 'tr-accordion-content';

export const accordionTypes = ['single', 'multiple'] as const;

export type AccordionType = (typeof accordionTypes)[number];
export type AccordionValue = string | null | string[];

export const accordionContract = {
  defaultCollapsible: true,
  defaultType: 'single',
} as const satisfies {
  defaultCollapsible: boolean;
  defaultType: AccordionType;
};

export const accordionChangeEventName = 'tinyrack:accordion-change' as const;

export type AccordionChangeDetail = {
  item: HTMLDetailsElement | null;
  root: HTMLElement;
  type: AccordionType;
  value: AccordionValue;
};
