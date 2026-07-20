import '../../core/core.css';
import './collapsible.css';
import { type CSSProperties, createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRCollapsible, TRCollapsibleRoot } from './index.js';

test('uses Base UI collapsible behavior', async () => {
  expect(TRCollapsible.Root).toBe(TRCollapsibleRoot);
  await render(
    <TRCollapsible.Root defaultOpen>
      <TRCollapsible.Trigger>Details</TRCollapsible.Trigger>
      <TRCollapsible.Panel>Content</TRCollapsible.Panel>
    </TRCollapsible.Root>,
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
        <TRCollapsible.Root data-testid="root" onOpenChange={setOpen} open={open}>
          <TRCollapsible.Trigger>Details</TRCollapsible.Trigger>
          <TRCollapsible.Panel keepMounted>Content</TRCollapsible.Panel>
        </TRCollapsible.Root>
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

test('opens from Enter while retaining trigger focus', async () => {
  const screen = await render(
    <TRCollapsible.Root>
      <TRCollapsible.Trigger>Enter details</TRCollapsible.Trigger>
      <TRCollapsible.Panel>Enter content</TRCollapsible.Panel>
    </TRCollapsible.Root>,
  );
  const trigger = screen.getByRole('button', { name: 'Enter details' });

  await userEvent.type(trigger, '{Enter}');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect.element(trigger).toHaveFocus();
});

test('closes from Space while retaining trigger focus', async () => {
  const screen = await render(
    <TRCollapsible.Root defaultOpen>
      <TRCollapsible.Trigger>Space details</TRCollapsible.Trigger>
      <TRCollapsible.Panel>Space content</TRCollapsible.Panel>
    </TRCollapsible.Root>,
  );
  const trigger = screen.getByRole('button', { name: 'Space details' });

  await userEvent.type(trigger, '[Space]');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect.element(trigger).toHaveFocus();
});

test('animates the panel open and closed with design-system motion tokens', async () => {
  await render(
    <TRCollapsible.Root
      style={
        {
          '--tr-collapsible-duration': 'var(--tinyrack-duration-slow)',
        } as CSSProperties
      }
    >
      <TRCollapsible.Trigger>Animated details</TRCollapsible.Trigger>
      <TRCollapsible.Panel>Animated content</TRCollapsible.Panel>
    </TRCollapsible.Root>,
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
  await expect
    .poll(() => panel?.isConnected === true && panel.hasAttribute('data-ending-style'))
    .toBe(true);
  await expect.poll(() => panel?.isConnected).toBe(false);
});

test('blocks disabled interaction and preserves part refs and native props', async () => {
  const onOpenChange = vi.fn();
  const rootRef = createRef<HTMLDivElement>();
  const triggerRef = createRef<HTMLButtonElement>();
  const panelRef = createRef<HTMLDivElement>();

  await render(
    <TRCollapsible.Root
      className="consumer-root"
      data-testid="collapsible"
      disabled
      onOpenChange={onOpenChange}
      ref={rootRef}
    >
      <TRCollapsible.Trigger ref={triggerRef}>
        Unavailable details
      </TRCollapsible.Trigger>
      <TRCollapsible.Panel hiddenUntilFound ref={panelRef}>
        Hidden content
      </TRCollapsible.Panel>
    </TRCollapsible.Root>,
  );

  expect(rootRef.current).toHaveClass('tr-collapsible', 'consumer-root');
  expect(triggerRef.current?.getAttribute('aria-disabled')).toBe('true');
  expect(panelRef.current?.getAttribute('hidden')).toBe('until-found');
  triggerRef.current?.click();
  triggerRef.current?.focus();
  await userEvent.keyboard('{Enter}');
  expect(onOpenChange).not.toHaveBeenCalled();
});
