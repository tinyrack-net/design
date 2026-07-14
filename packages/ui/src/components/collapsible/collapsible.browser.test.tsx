import '../../core/core.css';
import './collapsible.css';
import { type CSSProperties, createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
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

test('opens and closes from Enter and Space while retaining trigger focus', async () => {
  await render(
    <Collapsible.Root>
      <Collapsible.Trigger>Keyboard details</Collapsible.Trigger>
      <Collapsible.Panel>Keyboard content</Collapsible.Panel>
    </Collapsible.Root>,
  );
  const trigger = document.querySelector<HTMLButtonElement>('.tr-collapsible-summary');

  trigger?.focus();
  await userEvent.keyboard('{Enter}');
  await expect.poll(() => trigger?.getAttribute('aria-expanded')).toBe('true');
  expect(document.activeElement).toBe(trigger);
  await userEvent.keyboard(' ');
  await expect.poll(() => trigger?.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(trigger);
});

test('animates the panel open and closed with design-system motion tokens', async () => {
  await render(
    <Collapsible.Root
      style={
        {
          '--tr-collapsible-duration': 'var(--tinyrack-duration-slow)',
        } as CSSProperties
      }
    >
      <Collapsible.Trigger>Animated details</Collapsible.Trigger>
      <Collapsible.Panel>Animated content</Collapsible.Panel>
    </Collapsible.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-collapsible-summary');
  trigger?.click();

  await expect
    .poll(() =>
      document
        .querySelector('.tr-collapsible-content')
        ?.hasAttribute('data-starting-style'),
    )
    .toBe(true);

  const panel = document.querySelector<HTMLElement>('.tr-collapsible-content');
  const panelStyle = getComputedStyle(panel as HTMLElement);
  expect(panelStyle.transitionProperty).toContain('height');
  expect(panelStyle.transitionDuration).toContain('0.18s');

  await expect.poll(() => panel?.hasAttribute('data-starting-style')).toBe(false);
  trigger?.click();
  await expect.poll(() => panel?.hasAttribute('data-ending-style')).toBe(true);
  expect(panel?.isConnected).toBe(true);
  await expect.poll(() => panel?.isConnected).toBe(false);
});

test('blocks disabled interaction and preserves part refs and native props', async () => {
  const onOpenChange = vi.fn();
  const rootRef = createRef<HTMLDivElement>();
  const triggerRef = createRef<HTMLButtonElement>();
  const panelRef = createRef<HTMLDivElement>();

  await render(
    <Collapsible.Root
      className="consumer-root"
      data-testid="collapsible"
      disabled
      onOpenChange={onOpenChange}
      ref={rootRef}
    >
      <Collapsible.Trigger ref={triggerRef}>Unavailable details</Collapsible.Trigger>
      <Collapsible.Panel hiddenUntilFound ref={panelRef}>
        Hidden content
      </Collapsible.Panel>
    </Collapsible.Root>,
  );

  expect(rootRef.current).toHaveClass('tr-collapsible', 'consumer-root');
  expect(triggerRef.current?.getAttribute('aria-disabled')).toBe('true');
  expect(panelRef.current?.getAttribute('hidden')).toBe('until-found');
  triggerRef.current?.click();
  triggerRef.current?.focus();
  await userEvent.keyboard('{Enter}');
  expect(onOpenChange).not.toHaveBeenCalled();
});
