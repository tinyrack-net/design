import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  accordionChangeEventName,
  accordionClassName,
  accordionContentClassName,
  accordionContract,
  accordionItemClassName,
  accordionSummaryClassName,
  accordionTypes,
} from './contract.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionSummary,
} from './react.js';

describe('Accordion contract', () => {
  it('locks the public classes, values, defaults, and event name', () => {
    expect(accordionClassName).toBe('tr-accordion');
    expect(accordionItemClassName).toBe('tr-accordion-item');
    expect(accordionSummaryClassName).toBe('tr-accordion-summary');
    expect(accordionContentClassName).toBe('tr-accordion-content');
    expect(accordionTypes).toEqual(['single', 'multiple']);
    expect(accordionContract).toEqual({
      defaultCollapsible: true,
      defaultType: 'single',
    });
    expect(accordionChangeEventName).toBe('tinyrack:accordion-change');
  });

  it('renders a native single-value disclosure group in SSR output', () => {
    const html = renderToString(
      createElement(
        Accordion,
        { defaultValue: 'network' },
        createElement(
          AccordionItem,
          { value: 'network' },
          createElement(AccordionSummary, null, 'Network'),
          createElement(AccordionContent, null, 'Online'),
        ),
        createElement(
          AccordionItem,
          { value: 'storage' },
          createElement(AccordionSummary, null, 'Storage'),
          createElement(AccordionContent, null, 'Healthy'),
        ),
      ),
    );

    expect(html).toContain('class="tr-accordion"');
    expect(html).toContain('data-collapsible="true"');
    expect(html).toContain('data-type="single"');
    expect(html).toContain('data-value="network"');
    expect(html).toMatch(/<details[^>]*open=""[^>]*>/);
    expect(html).toContain('class="tr-disclosure tr-accordion-item"');
    expect(html.match(/name="tr-accordion-[^"]+"/g)).toHaveLength(2);
    expect(html).toContain('class="tr-disclosure-summary tr-accordion-summary"');
    expect(html).toContain('class="tr-disclosure-content tr-accordion-content"');
  });

  it('renders multiple initial values without a native exclusive name', () => {
    const html = renderToString(
      createElement(
        Accordion,
        { defaultValue: ['network', 'storage'], type: 'multiple' },
        createElement(
          AccordionItem,
          { value: 'network' },
          createElement(AccordionSummary, null, 'Network'),
        ),
        createElement(
          AccordionItem,
          { value: 'storage' },
          createElement(AccordionSummary, null, 'Storage'),
        ),
      ),
    );

    expect(html).toContain('data-type="multiple"');
    expect(html).toContain('data-values="[&quot;network&quot;,&quot;storage&quot;]"');
    expect(html.match(/ open=""/g)).toHaveLength(2);
    expect(html).not.toContain(' name=');
  });

  it('rejects Accordion parts rendered outside their group context', () => {
    expect(() =>
      renderToString(createElement(AccordionItem, { value: 'network' })),
    ).toThrow('AccordionItem must be used within Accordion.');
    expect(() => renderToString(createElement(AccordionSummary))).toThrow(
      'AccordionSummary must be used within Accordion.',
    );
    expect(() => renderToString(createElement(AccordionContent))).toThrow(
      'AccordionContent must be used within Accordion.',
    );
  });
});
