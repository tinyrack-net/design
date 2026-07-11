import { createRef, useState } from 'react';
import '../../core/core.css';
import './accordion.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionSummary,
} from './react.js';

const themeDatasetKey = 'theme';

function waitForReact() {
  return new Promise((resolve) =>
    setTimeout(() => requestAnimationFrame(() => resolve(undefined)), 0),
  );
}

function item(value: string) {
  const result = document.querySelector<HTMLDetailsElement>(
    `[data-tr-accordion-item][data-value="${value}"]`,
  );
  if (result === null) {
    throw new Error(`Unable to find Accordion item: ${value}`);
  }
  return result;
}

function summary(value: string) {
  const result = item(value).querySelector<HTMLElement>('summary');
  if (result === null) {
    throw new Error(`Unable to find Accordion summary: ${value}`);
  }
  return result;
}

function RackAccordion({ collapsible = true }: { collapsible?: boolean }) {
  return (
    <Accordion collapsible={collapsible} defaultValue="network">
      <AccordionItem value="network">
        <AccordionSummary>Network</AccordionSummary>
        <AccordionContent>Online</AccordionContent>
      </AccordionItem>
      <AccordionItem value="storage">
        <AccordionSummary>Storage</AccordionSummary>
        <AccordionContent>Healthy</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

test('Accordion renders Disclosure semantics and grouped CSS', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(<RackAccordion />);
  const root = document.querySelector<HTMLElement>('.tr-accordion');
  const network = item('network');
  const storage = item('storage');
  const networkSummary = summary('network');

  if (root === null) {
    throw new Error('Unable to find Accordion root.');
  }
  await expect.element(networkSummary).toBeVisible();
  expect(network.open).toBe(true);
  expect(storage.open).toBe(false);
  expect(network.name).not.toBe('');
  expect(storage.name).toBe(network.name);
  expect(getComputedStyle(root).borderTopWidth).toBe('1px');
  expect(getComputedStyle(root).borderTopLeftRadius).toBe('6px');
  expect(getComputedStyle(network).borderTopWidth).toBe('0px');
  expect(getComputedStyle(storage).borderTopWidth).toBe('1px');
});

test('Accordion supports controlled single state and external updates', async () => {
  const changes: Array<string | null> = [];

  function ControlledAccordion() {
    const [value, setValue] = useState<string | null>('network');
    return (
      <>
        <button type="button" onClick={() => setValue('storage')}>
          Open storage
        </button>
        <Accordion
          value={value}
          onValueChange={(next) => {
            changes.push(next);
            setValue(next);
          }}
        >
          <AccordionItem value="network">
            <AccordionSummary>Network</AccordionSummary>
          </AccordionItem>
          <AccordionItem value="storage">
            <AccordionSummary>Storage</AccordionSummary>
          </AccordionItem>
        </Accordion>
      </>
    );
  }

  await render(<ControlledAccordion />);
  summary('storage').click();
  await waitForReact();
  expect(item('network').open).toBe(false);
  expect(item('storage').open).toBe(true);
  expect(changes).toEqual(['storage']);

  document.querySelector<HTMLButtonElement>('button')?.click();
  await waitForReact();
  expect(item('storage').open).toBe(true);
  expect(changes).toEqual(['storage']);
});

test('Accordion supports controlled and uncontrolled multiple values', async () => {
  const changes: string[][] = [];
  await render(
    <Accordion
      defaultValue={['network']}
      onValueChange={(value) => changes.push(value)}
      type="multiple"
    >
      <AccordionItem value="network">
        <AccordionSummary>Network</AccordionSummary>
      </AccordionItem>
      <AccordionItem value="storage">
        <AccordionSummary>Storage</AccordionSummary>
      </AccordionItem>
    </Accordion>,
  );

  summary('storage').click();
  await waitForReact();
  expect(item('network').open).toBe(true);
  expect(item('storage').open).toBe(true);
  expect(changes).toEqual([['network', 'storage']]);
});

test('Accordion preserves refs, user events, and consumer CSS overrides', async () => {
  const summaryRef = createRef<HTMLElement>();
  let clicks = 0;
  await render(
    <Accordion
      defaultValue="network"
      style={{ '--tr-accordion-radius': '12px' } as React.CSSProperties}
    >
      <AccordionItem value="network">
        <AccordionSummary
          onClick={(event) => {
            clicks += 1;
            event.preventDefault();
          }}
          ref={summaryRef}
        >
          Network
        </AccordionSummary>
      </AccordionItem>
    </Accordion>,
  );

  summary('network').click();
  await waitForReact();
  expect(clicks).toBe(1);
  expect(summaryRef.current).toBe(summary('network'));
  expect(item('network').open).toBe(true);
  const root = document.querySelector<HTMLElement>('.tr-accordion');
  if (root === null) {
    throw new Error('Unable to find Accordion root.');
  }
  expect(getComputedStyle(root).borderTopLeftRadius).toBe('12px');
});
