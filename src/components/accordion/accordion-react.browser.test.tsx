import { createRef, useState } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Accordion, AccordionItem, AccordionSummary } from './react.js';

function waitForReact() {
  return new Promise((resolve) =>
    setTimeout(() => requestAnimationFrame(() => resolve(undefined)), 0),
  );
}

test('Accordion supports controlled multiple state, callback refs and guarded events', async () => {
  const values: string[][] = [];
  let rootElement: HTMLDivElement | null = null;

  function ControlledMultiple() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Accordion
        className="rack-accordion"
        onValueChange={(next) => {
          values.push(next);
          setValue(next);
        }}
        ref={(element) => {
          rootElement = element;
        }}
        type="multiple"
        value={value}
      >
        <AccordionItem value="network">
          <AccordionSummary>Network</AccordionSummary>
        </AccordionItem>
      </Accordion>
    );
  }

  const rendered = await render(<ControlledMultiple />);
  const root = rendered.container.querySelector<HTMLElement>('[data-tr-accordion]')!;
  const summary = root.querySelector<HTMLElement>('summary')!;
  expect(rootElement).toBe(root);
  expect(root.dataset['values']).toBe('[]');

  root.dispatchEvent(
    new CustomEvent('tinyrack:accordion-change', {
      detail: { root: document.body, type: 'multiple', value: ['ignored'] },
    }),
  );
  root.dispatchEvent(
    new CustomEvent('tinyrack:accordion-change', {
      detail: { root, type: 'single', value: 'ignored' },
    }),
  );
  expect(values).toEqual([]);

  summary.click();
  await waitForReact();
  expect(values).toEqual([['network']]);
  expect(root.dataset['values']).toBe('["network"]');
});

test('Accordion assigns object refs and normalizes malformed callback values', async () => {
  const ref = createRef<HTMLDivElement>();
  const singleValues: Array<string | null> = [];
  const multipleValues: string[][] = [];
  const singleRender = await render(
    <Accordion onValueChange={(value) => singleValues.push(value)} ref={ref}>
      <AccordionItem value="network">
        <AccordionSummary>Network</AccordionSummary>
      </AccordionItem>
    </Accordion>,
  );
  const singleRoot =
    singleRender.container.querySelector<HTMLElement>('[data-tr-accordion]')!;
  expect(ref.current).toBe(singleRoot);
  singleRoot.dispatchEvent(
    new CustomEvent('tinyrack:accordion-change', {
      detail: { root: singleRoot, type: 'single', value: ['invalid'] },
    }),
  );
  expect(singleValues).toEqual([null]);

  const multipleRender = await render(
    <Accordion onValueChange={(value) => multipleValues.push(value)} type="multiple">
      <AccordionItem value="network">
        <AccordionSummary>Network</AccordionSummary>
      </AccordionItem>
    </Accordion>,
  );
  const multipleRoot =
    multipleRender.container.querySelector<HTMLElement>('[data-tr-accordion]')!;
  multipleRoot.dispatchEvent(
    new CustomEvent('tinyrack:accordion-change', {
      detail: { root: multipleRoot, type: 'multiple', value: 'invalid' },
    }),
  );
  expect(multipleValues).toEqual([[]]);
});
