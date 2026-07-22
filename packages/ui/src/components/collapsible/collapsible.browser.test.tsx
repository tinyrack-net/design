import '../../core/core.css';
import './collapsible.css';
import { act, type CSSProperties, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
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

test('visually distinguishes a disabled trigger from an interactive trigger', async () => {
  await render(
    <>
      <TRCollapsible.Root>
        <TRCollapsible.Trigger>Interactive details</TRCollapsible.Trigger>
      </TRCollapsible.Root>
      <TRCollapsible.Root disabled>
        <TRCollapsible.Trigger>Unavailable details</TRCollapsible.Trigger>
      </TRCollapsible.Root>
    </>,
  );

  const interactive = document.querySelector<HTMLElement>(
    '.tr-collapsible-summary:not([data-disabled])',
  );
  const disabled = document.querySelector<HTMLElement>(
    '.tr-collapsible-summary[data-disabled]',
  );

  expect(disabled).not.toBeNull();
  expect(getComputedStyle(disabled as HTMLElement).cursor).toBe('not-allowed');
  expect(getComputedStyle(disabled as HTMLElement).opacity).not.toBe(
    getComputedStyle(interactive as HTMLElement).opacity,
  );
});

test('rotates a nested trigger chevron from trigger state', async () => {
  const screen = await render(
    <TRCollapsible.Root>
      <div>
        <TRCollapsible.Trigger>Nested details</TRCollapsible.Trigger>
      </div>
      <TRCollapsible.Panel>Nested content</TRCollapsible.Panel>
    </TRCollapsible.Root>,
  );
  const trigger = screen.getByRole('button', { name: 'Nested details' });
  const closedTransform = getComputedStyle(trigger.element(), '::after').transform;

  await userEvent.click(trigger);
  await expect.element(trigger).toHaveAttribute('data-panel-open');
  await expect
    .poll(() => getComputedStyle(trigger.element(), '::after').transform)
    .not.toBe(closedTransform);
});

test('supports the default, persistent, and findable panel lifecycles', async () => {
  const screen = await render(
    <>
      <TRCollapsible.Root>
        <TRCollapsible.Trigger>Unmounted details</TRCollapsible.Trigger>
        <TRCollapsible.Panel>Unmounted content</TRCollapsible.Panel>
      </TRCollapsible.Root>
      <TRCollapsible.Root>
        <TRCollapsible.Trigger>Persistent details</TRCollapsible.Trigger>
        <TRCollapsible.Panel keepMounted>Persistent content</TRCollapsible.Panel>
      </TRCollapsible.Root>
      <TRCollapsible.Root>
        <TRCollapsible.Trigger>Findable details</TRCollapsible.Trigger>
        <TRCollapsible.Panel hiddenUntilFound keepMounted>
          Findable content
        </TRCollapsible.Panel>
      </TRCollapsible.Root>
    </>,
  );

  expect(document.body.textContent).not.toContain('Unmounted content');
  const persistent = screen.getByText('Persistent content').element() as HTMLElement;
  const findable = screen.getByText('Findable content').element() as HTMLElement;
  expect(persistent.hidden).toBe(true);
  expect(findable.getAttribute('hidden')).toBe('until-found');

  await userEvent.click(screen.getByRole('button', { name: 'Unmounted details' }));
  await expect.element(screen.getByText('Unmounted content')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Unmounted details' }));
  await expect
    .poll(() => document.body.textContent?.includes('Unmounted content'))
    .toBe(false);
});

test('keeps controlled state consumer-owned while uncontrolled state toggles', async () => {
  const onControlledChange = vi.fn();
  const screen = await render(
    <>
      <TRCollapsible.Root onOpenChange={onControlledChange} open={false}>
        <TRCollapsible.Trigger>Controlled details</TRCollapsible.Trigger>
        <TRCollapsible.Panel>Controlled content</TRCollapsible.Panel>
      </TRCollapsible.Root>
      <TRCollapsible.Root>
        <TRCollapsible.Trigger>Uncontrolled details</TRCollapsible.Trigger>
        <TRCollapsible.Panel>Uncontrolled content</TRCollapsible.Panel>
      </TRCollapsible.Root>
    </>,
  );

  const controlled = screen.getByRole('button', {
    name: 'Controlled details',
    exact: true,
  });
  await userEvent.click(controlled);
  expect(onControlledChange).toHaveBeenCalledOnce();
  await expect.element(controlled).toHaveAttribute('aria-expanded', 'false');
  expect(document.body.textContent).not.toContain('Controlled content');

  const uncontrolled = screen.getByRole('button', { name: 'Uncontrolled details' });
  await userEvent.click(uncontrolled);
  await expect.element(uncontrolled).toHaveAttribute('aria-expanded', 'true');
  await expect.element(screen.getByText('Uncontrolled content')).toBeVisible();
});

test('keeps a disabled trigger focusable while blocking keyboard activation', async () => {
  const onOpenChange = vi.fn();
  const screen = await render(
    <>
      <button type="button">Before</button>
      <TRCollapsible.Root disabled onOpenChange={onOpenChange}>
        <TRCollapsible.Trigger>Unavailable details</TRCollapsible.Trigger>
      </TRCollapsible.Root>
      <button type="button">After</button>
    </>,
  );

  const before = screen.getByRole('button', { name: 'Before' });
  before.element().focus();
  await userEvent.tab();
  const disabled = screen.getByRole('button', { name: 'Unavailable details' });
  await expect.element(disabled).toHaveFocus();
  expect((disabled.element() as HTMLElement).tabIndex).toBe(0);
  await userEvent.keyboard('{Enter}');
  await expect.element(disabled).toHaveAttribute('aria-expanded', 'false');
  expect(onOpenChange).not.toHaveBeenCalled();
  await userEvent.tab();
  await expect.element(screen.getByRole('button', { name: 'After' })).toHaveFocus();
});

test('preserves consumer props, part refs, and customization tokens', async () => {
  const triggerRef = createRef<HTMLButtonElement>();
  const panelRef = createRef<HTMLDivElement>();
  const onClick = vi.fn();
  await render(
    <TRCollapsible.Root
      defaultOpen
      style={
        {
          '--tr-collapsible-background': 'rgb(23, 23, 23)',
        } as CSSProperties
      }
    >
      <TRCollapsible.Trigger
        className="consumer-trigger"
        onClick={onClick}
        ref={triggerRef}
      >
        Customized details
      </TRCollapsible.Trigger>
      <TRCollapsible.Panel className="consumer-panel" ref={panelRef}>
        Customized content
      </TRCollapsible.Panel>
    </TRCollapsible.Root>,
  );

  expect(triggerRef.current).toHaveClass('tr-collapsible-summary', 'consumer-trigger');
  expect(panelRef.current).toHaveClass('tr-collapsible-content', 'consumer-panel');
  expect(
    getComputedStyle(document.querySelector('.tr-collapsible') as HTMLElement)
      .backgroundColor,
  ).toBe('rgb(23, 23, 23)');
  triggerRef.current?.click();
  expect(onClick).toHaveBeenCalledOnce();
});

test('declares reduced-motion overrides for trigger and panel transitions', () => {
  function flattenRules(rules: CSSRuleList): CSSRule[] {
    return [...rules].flatMap((rule) =>
      'cssRules' in rule
        ? [rule, ...flattenRules((rule as CSSGroupingRule).cssRules)]
        : [rule],
    );
  }

  const rules = [...document.styleSheets].flatMap((sheet) => {
    try {
      return flattenRules(sheet.cssRules);
    } catch {
      return [];
    }
  });
  const reducedMotion = rules.find(
    (rule): rule is CSSMediaRule =>
      rule instanceof CSSMediaRule &&
      rule.conditionText === '(prefers-reduced-motion: reduce)',
  );
  const reducedMotionCss = [...(reducedMotion?.cssRules ?? [])]
    .map((rule) => rule.cssText)
    .join(' ');

  expect(reducedMotionCss).toContain('.tr-collapsible-summary::after');
  expect(reducedMotionCss).toContain('.tr-collapsible-content');
  expect(reducedMotionCss).toContain('transition: none');
});

test('renders lifecycle state on the server and hydrates without recovery', async () => {
  function HydratedCollapsibles() {
    return (
      <>
        <TRCollapsible.Root>
          <TRCollapsible.Trigger>Hydrated default</TRCollapsible.Trigger>
          <TRCollapsible.Panel>Unmounted server content</TRCollapsible.Panel>
        </TRCollapsible.Root>
        <TRCollapsible.Root>
          <TRCollapsible.Trigger>Hydrated persistent</TRCollapsible.Trigger>
          <TRCollapsible.Panel keepMounted>
            Persistent server content
          </TRCollapsible.Panel>
        </TRCollapsible.Root>
      </>
    );
  }

  const host = document.createElement('div');
  host.innerHTML = renderToString(<HydratedCollapsibles />);
  expect(host.textContent).not.toContain('Unmounted server content');
  expect(host.textContent).toContain('Persistent server content');
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, <HydratedCollapsibles />, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  const persistent = [
    ...host.querySelectorAll<HTMLElement>('.tr-collapsible-content'),
  ].find((panel) => panel.textContent === 'Persistent server content');
  expect(persistent?.hidden).toBe(true);

  await act(async () => root.unmount());
  host.remove();
});
