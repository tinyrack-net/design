import '../../core/core.css';
import './accordion.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Accordion, AccordionRoot } from './index.js';

test('uses Base UI for accessible accordion state', async () => {
  expect(Accordion.Root).toBe(AccordionRoot);
  await render(
    <Accordion.Root defaultValue={['network']}>
      <Accordion.Item value="network">
        <Accordion.Header>
          <Accordion.Trigger>Network</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Online</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>,
  );
  const trigger = document.querySelector<HTMLButtonElement>('.tr-accordion-trigger');
  expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  trigger?.click();
  await expect.poll(() => trigger?.getAttribute('aria-expanded')).toBe('false');
});

test('visually distinguishes disabled items and keeps them closed', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <Accordion.Root>
      <Accordion.Item data-testid="interactive-item" value="network">
        <Accordion.Header>
          <Accordion.Trigger>Network</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Online</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item data-testid="disabled-item" disabled value="logs">
        <Accordion.Header>
          <Accordion.Trigger>Logs</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Unavailable</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>,
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

test('animates the panel when it closes', async () => {
  await render(
    <Accordion.Root defaultValue={['network']}>
      <Accordion.Item value="network">
        <Accordion.Header>
          <Accordion.Trigger>Network</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Online</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>,
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
