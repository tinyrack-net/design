import './collapsible.css';
import { useState } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Collapsible, CollapsibleRoot } from './index.js';

test('uses Base UI collapsible behavior', async () => {
  expect(Collapsible.Root).toBe(CollapsibleRoot);
  await render(
    <Collapsible.Root defaultOpen>
      <Collapsible.Trigger>Details</Collapsible.Trigger>
      <Collapsible.Panel>Content</Collapsible.Panel>
    </Collapsible.Root>,
  );
  const trigger = document.querySelector<HTMLButtonElement>('.tr-collapsible-summary');
  expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  trigger?.click();
  await expect.poll(() => trigger?.getAttribute('aria-expanded')).toBe('false');
});

test('preserves controlled state, native props, and the trigger relationship', async () => {
  function ControlledCollapsible() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Collapsible.Root data-testid="root" onOpenChange={setOpen} open={open}>
          <Collapsible.Trigger>Details</Collapsible.Trigger>
          <Collapsible.Panel keepMounted>Content</Collapsible.Panel>
        </Collapsible.Root>
        <output>{open ? 'open' : 'closed'}</output>
      </>
    );
  }

  await render(<ControlledCollapsible />);
  const root = document.querySelector('[data-testid="root"]');
  const trigger = document.querySelector<HTMLButtonElement>('.tr-collapsible-summary');
  const panel = document.querySelector<HTMLElement>('.tr-collapsible-content');
  expect(root).not.toBeNull();
  expect(panel?.hidden).toBe(true);
  trigger?.click();
  await expect.poll(() => document.querySelector('output')?.textContent).toBe('open');
  expect(trigger?.getAttribute('aria-controls')).toBe(panel?.id);
  expect(panel?.hidden).toBe(false);
});
