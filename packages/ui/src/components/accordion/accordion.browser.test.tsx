import '../../core/core.css';
import './accordion.css';
import { act, type CSSProperties, createRef, Fragment, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  TRAccordion,
  TRAccordionHeader,
  TRAccordionItem,
  TRAccordionPanel,
  TRAccordionRoot,
  TRAccordionTrigger,
} from './index.js';

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

test('exports the complete anatomy and preserves native props, classes, and refs', async () => {
  expect(TRAccordion).toEqual({
    Root: TRAccordionRoot,
    Item: TRAccordionItem,
    Header: TRAccordionHeader,
    Trigger: TRAccordionTrigger,
    Panel: TRAccordionPanel,
  });
  const rootRef = createRef<HTMLDivElement>();
  const itemRef = createRef<HTMLDivElement>();
  const headerRef = createRef<HTMLHeadingElement>();
  const triggerRef = createRef<HTMLElement>();
  const panelRef = createRef<HTMLDivElement>();

  await render(
    <TRAccordion.Root
      className="consumer-root"
      data-testid="root"
      defaultValue={['network']}
      ref={rootRef}
    >
      <TRAccordion.Item className="consumer-item" ref={itemRef} value="network">
        <TRAccordion.Header className="consumer-header" ref={headerRef}>
          <TRAccordion.Trigger
            className="consumer-trigger"
            data-testid="trigger"
            ref={triggerRef}
          >
            Network
          </TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel
          className="consumer-panel"
          data-testid="panel"
          ref={panelRef}
        >
          Online
        </TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );

  expect(rootRef.current).toHaveClass('tr-accordion', 'consumer-root');
  expect(rootRef.current).toHaveAttribute('data-testid', 'root');
  expect(itemRef.current).toHaveClass('tr-accordion-item', 'consumer-item');
  expect(headerRef.current).toHaveClass('tr-accordion-header', 'consumer-header');
  expect(headerRef.current?.tagName).toBe('H3');
  expect(triggerRef.current).toHaveClass(
    'tr-accordion-trigger',
    'tr-collapsible-summary',
    'consumer-trigger',
  );
  expect(panelRef.current).toHaveClass(
    'tr-accordion-content',
    'tr-collapsible-content',
    'consumer-panel',
  );
  expect(triggerRef.current?.getAttribute('aria-controls')).toBe(panelRef.current?.id);
  expect(panelRef.current?.getAttribute('aria-labelledby')).toBe(
    triggerRef.current?.id,
  );
});

test('keeps only one uncontrolled item open in single mode', async () => {
  const screen = await render(
    <TRAccordion.Root defaultValue={['network']}>
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
    </TRAccordion.Root>,
  );
  const network = screen.getByRole('button', { name: 'Network' });
  const storage = screen.getByRole('button', { name: 'Storage' });

  await storage.click();
  await expect.element(storage).toHaveAttribute('aria-expanded', 'true');
  await expect.element(network).toHaveAttribute('aria-expanded', 'false');
});

test('toggles with Enter and Space and keeps disabled triggers in document tab order', async () => {
  const screen = await render(
    <TRAccordion.Root>
      <TRAccordion.Item value="network">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Network</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Online</TRAccordion.Panel>
      </TRAccordion.Item>
      <TRAccordion.Item disabled value="logs">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Logs</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Unavailable</TRAccordion.Panel>
      </TRAccordion.Item>
      <TRAccordion.Item value="storage">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Storage</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Healthy</TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );
  const network = screen.getByRole('button', { name: 'Network' });
  const logs = screen.getByRole('button', { name: 'Logs' });
  const storage = screen.getByRole('button', { name: 'Storage' });

  await userEvent.type(network, '{Enter}');
  await expect.element(network).toHaveAttribute('aria-expanded', 'true');
  await expect.element(network).toHaveFocus();
  await userEvent.type(network, '[Space]');
  await expect.element(network).toHaveAttribute('aria-expanded', 'false');
  await expect.element(network).toHaveFocus();
  await userEvent.keyboard('{Tab}');
  await expect.element(logs).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await expect.element(logs).toHaveAttribute('aria-expanded', 'false');
  await userEvent.keyboard('{Tab}');
  await expect.element(storage).toHaveFocus();
});

test('root disabled blocks pointer and keyboard changes', async () => {
  const onValueChange = vi.fn();
  const screen = await render(
    <TRAccordion.Root disabled onValueChange={onValueChange}>
      <TRAccordion.Item value="network">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Network</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Online</TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );
  const trigger = screen.getByRole('button', { name: 'Network' });

  await expect.element(trigger).toHaveAttribute('aria-disabled', 'true');
  await trigger.click({ force: true });
  trigger.element().focus();
  await userEvent.keyboard('{Enter}');
  expect(onValueChange).not.toHaveBeenCalled();
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
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

test('does not treat unrelated disabled children as accordion items', async () => {
  function ItemMetadata(_props: { disabled: boolean; value: string }) {
    return null;
  }

  await render(
    <TRAccordion.Root defaultValue={['network']}>
      <ItemMetadata disabled value="network" />
      <TRAccordion.Item value="network">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Network</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Online</TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );

  expect(
    document.querySelector<HTMLButtonElement>('.tr-accordion-trigger'),
  ).toHaveAttribute('aria-expanded', 'true');
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

test('supports persistent and find-in-page panel lifecycles', async () => {
  await render(
    <TRAccordion.Root>
      <TRAccordion.Item value="persistent">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Persistent</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel data-testid="persistent" keepMounted>
          Mounted content
        </TRAccordion.Panel>
      </TRAccordion.Item>
      <TRAccordion.Item value="findable">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Findable</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel data-testid="findable" hiddenUntilFound>
          Searchable content
        </TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );

  expect(document.querySelector('[data-testid="persistent"]')).toHaveAttribute(
    'hidden',
    '',
  );
  expect(document.querySelector('[data-testid="findable"]')).toHaveAttribute(
    'hidden',
    'until-found',
  );
});

test('honors accordion appearance tokens', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <TRAccordion.Root
      defaultValue={['network']}
      style={
        {
          '--tr-accordion-background': 'rgb(1, 2, 3)',
          '--tr-accordion-content-background': 'rgb(4, 5, 6)',
          '--tr-accordion-radius': 'var(--tinyrack-radius-lg)',
        } as CSSProperties
      }
    >
      <TRAccordion.Item value="network">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Network</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Online</TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>,
  );
  const root = document.querySelector<HTMLElement>('.tr-accordion');
  const panel = document.querySelector<HTMLElement>('.tr-accordion-content');

  expect(getComputedStyle(root as HTMLElement).backgroundColor).toBe('rgb(1, 2, 3)');
  expect(getComputedStyle(root as HTMLElement).borderRadius).toBe('8px');
  expect(getComputedStyle(panel as HTMLElement).backgroundColor).toBe('rgb(4, 5, 6)');
});

test('server-renders and hydrates open state without recovery', async () => {
  const fixture = (
    <TRAccordion.Root defaultValue={['network']}>
      <TRAccordion.Item value="network">
        <TRAccordion.Header>
          <TRAccordion.Trigger>Hydrated network</TRAccordion.Trigger>
        </TRAccordion.Header>
        <TRAccordion.Panel>Online</TRAccordion.Panel>
      </TRAccordion.Item>
    </TRAccordion.Root>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  const trigger = host.querySelector<HTMLButtonElement>('button');
  expect(hydrationErrors).toEqual([]);
  expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  trigger?.click();
  await expect.poll(() => trigger?.getAttribute('aria-expanded')).toBe('false');

  await act(async () => root.unmount());
  host.remove();
});
