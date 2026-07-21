import '../../core/core.css';
import './accordion.css';
import { Fragment, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRAccordion, TRAccordionRoot } from './index.js';

test('uses Base UI for accessible accordion state', async () => {
  expect(TRAccordion.Root).toBe(TRAccordionRoot);
  await render(
    <TRAccordion.Root defaultValue={['network']}>
      <TRAccordion.Item value="network">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Network</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Online</TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );
  const trigger = document.querySelector<HTMLButtonElement>('.tr-accordion-trigger');
  expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  trigger?.click();
  await expect.poll(() => trigger?.getAttribute('aria-expanded')).toBe('false');
});

test('preserves controlled multiple state and reports user changes', async () => {
  function ControlledAccordion() {
    const [value, setValue] = useState<string[]>(['network']);

    return (
      <>
        <TRAccordion.Root
          aria-label="Services"
          multiple
          onValueChange={(nextValue) => setValue(nextValue as string[])}
          value={value}
        >
          <TRAccordion.Item value="network">
            <TRAccordion.Header>
              <TRAccordion.Trigger>Network</TRAccordion.Trigger>
            </TRAccordion.Header>
            <TRAccordion.Panel>Online</TRAccordion.Panel>
          </TRAccordion.Item>
          <TRAccordion.Item value="storage">
            <TRAccordion.Header>
              <TRAccordion.Trigger>Storage</TRAccordion.Trigger>
            </TRAccordion.Header>
            <TRAccordion.Panel>Healthy</TRAccordion.Panel>
          </TRAccordion.Item>
        </TRAccordion.Root>
        <output>{value.join(', ')}</output>
      </>
    );
  }

  await render(<ControlledAccordion />);
  const storage = [...document.querySelectorAll<HTMLButtonElement>('button')].find(
    (button) => button.textContent === 'Storage',
  );
  storage?.click();
  await expect
    .poll(() => document.querySelector('output')?.textContent)
    .toBe('network, storage');
  expect(storage?.getAttribute('aria-expanded')).toBe('true');
});

test('visually distinguishes disabled items and keeps them closed', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <TRAccordion.Root>
      <TRAccordion.Item data-testid="interactive-item" value="network">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Network</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Online</TRAccordion.Panel>
      </TRAccordion.Item>
      <TRAccordion.Item data-testid="disabled-item" disabled value="logs">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Logs</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Unavailable</TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );

  const interactiveItem = document.querySelector<HTMLElement>(
    '[data-testid="interactive-item"]',
  );
  const disabledItem = document.querySelector<HTMLElement>(
    '[data-testid="disabled-item"]',
  );
  const disabledTrigger = disabledItem?.querySelector<HTMLButtonElement>(
    '.tr-accordion-trigger',
  );

  expect(disabledItem?.hasAttribute('data-disabled')).toBe(true);
  expect(disabledTrigger?.hasAttribute('data-disabled')).toBe(true);
  expect(getComputedStyle(disabledItem as HTMLElement).backgroundColor).not.toBe(
    getComputedStyle(interactiveItem as HTMLElement).backgroundColor,
  );

  disabledTrigger?.click();
  await expect.poll(() => disabledTrigger?.getAttribute('aria-expanded')).toBe('false');
  expect(disabledItem?.querySelector('.tr-accordion-content')).toBeNull();
});

test('rotates the chevron with the accordion state', async () => {
  await render(
    <TRAccordion.Root>
      <TRAccordion.Item value="network">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Network</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Online</TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-accordion-trigger');
  const closedTransform = getComputedStyle(trigger as HTMLElement, '::after').transform;

  trigger?.click();
  await expect.poll(() => trigger?.getAttribute('aria-expanded')).toBe('true');

  await expect
    .poll(() => getComputedStyle(trigger as HTMLElement, '::after').transform)
    .not.toBe(closedTransform);
});

test('removes a disabled item from an initially open value', async () => {
  await render(
    <TRAccordion.Root defaultValue={['logs']}>
      <Fragment key="disabled-items">
        {null}
        <TRAccordion.Item disabled value="logs">
          <TRAccordion.Header>
            <TRAccordion.Trigger>Logs</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel keepMounted>Unavailable</TRAccordion.Panel>
        </TRAccordion.Item>
      </Fragment>
    </TRAccordion.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-accordion-trigger');
  const item = document.querySelector<HTMLElement>('.tr-accordion-item');
  expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  expect(item?.hasAttribute('data-open')).toBe(false);
  expect(document.querySelector<HTMLElement>('.tr-accordion-content')?.hidden).toBe(
    true,
  );
});

test('normalizes a missing internal change value before notifying the consumer', () => {
  const onValueChange = vi.fn();
  const root = TRAccordionRoot<string>({ children: null, onValueChange });
  const handleValueChange = (
    root.props as {
      onValueChange: (value: string[] | undefined, eventDetails: never) => void;
    }
  ).onValueChange;

  handleValueChange(undefined, undefined as never);

  expect(onValueChange).toHaveBeenCalledWith([], undefined);
});

test('animates the panel when it closes', async () => {
  await render(
    <TRAccordion.Root defaultValue={['network']}>
      <TRAccordion.Item value="network">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Network</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Online</TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-accordion-trigger');
  const panel = document.querySelector<HTMLElement>('.tr-accordion-content');
  const panelStyle = getComputedStyle(panel as HTMLElement);

  expect(panel?.querySelector('.tr-accordion-content-inner')?.textContent).toBe(
    'Online',
  );
  expect(panelStyle.transitionProperty).toContain('height');
  expect(Number.parseFloat(panelStyle.transitionDuration)).toBeGreaterThan(0);

  trigger?.click();
  await expect.poll(() => panel?.hasAttribute('data-ending-style')).toBe(true);
  expect(panel?.isConnected).toBe(true);
  await expect.poll(() => panel?.isConnected).toBe(false);
});

test('animates the panel when it opens', async () => {
  await render(
    <TRAccordion.Root>
      <TRAccordion.Item value="network">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Network</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Online</TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-accordion-trigger');
  trigger?.click();

  await expect
    .poll(() => document.querySelector<HTMLElement>('.tr-accordion-content'))
    .not.toBeNull();
  const panel = document.querySelector<HTMLElement>('.tr-accordion-content');
  expect(getComputedStyle(panel as HTMLElement).transitionProperty).toContain('height');
  expect(
    Number.parseFloat(getComputedStyle(panel as HTMLElement).transitionDuration),
  ).toBeGreaterThan(0);
  await expect.poll(() => panel?.hasAttribute('data-open')).toBe(true);
});
