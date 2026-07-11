import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectElementParity } from '../../../e2e/fixtures/component-browser-harness.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionSummary,
} from './react.js';

test.each([
  { open: false, value: null },
  { open: true, value: 'network' },
])('Accordion DOM/React parity for value=$value', async ({ open, value }) => {
  const raw = document.createElement('div');
  raw.className = 'tr-accordion rack-group';
  raw.dataset['collapsible'] = 'true';
  raw.dataset['controlled'] = 'true';
  raw.dataset['trAccordion'] = 'true';
  raw.dataset['type'] = 'single';
  if (value !== null) raw.dataset['value'] = value;
  raw.innerHTML = `<details class="tr-disclosure tr-accordion-item rack-item" data-tr-accordion-item="true" data-value="network" name="rack-group"${open ? ' open' : ''}><summary class="tr-disclosure-summary tr-accordion-summary rack-summary" data-tr-accordion-summary="true">Network</summary><div class="tr-disclosure-content tr-accordion-content rack-content">Online</div></details>`;
  document.body.append(raw);

  const rendered = await render(
    <Accordion className="rack-group" value={value}>
      <AccordionItem className="rack-item" value="network">
        <AccordionSummary className="rack-summary">Network</AccordionSummary>
        <AccordionContent className="rack-content">Online</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
  const react = rendered.container.querySelector('.tr-accordion')!;
  const reactItem = react.querySelector('details')!;

  expectElementParity(raw, react);
  expectElementParity(raw.querySelector('details')!, reactItem, {
    ignoreAttributes: ['name'],
  });
  expectElementParity(raw.querySelector('summary')!, react.querySelector('summary')!);
  expectElementParity(
    raw.querySelector('.tr-accordion-content')!,
    react.querySelector('.tr-accordion-content')!,
  );
  raw.remove();
});
