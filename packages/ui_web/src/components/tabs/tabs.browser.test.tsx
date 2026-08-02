import '../../core/core.css';
import './tabs.css';
import { act, type CSSProperties, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  TRTabs,
  TRTabsIndicator,
  TRTabsList,
  TRTabsPanel,
  TRTabsRoot,
  TRTabsTab,
} from './index.js';

test('exports its complete anatomy and preserves native props, classes, and refs', async () => {
  expect(TRTabs).toEqual({
    Root: TRTabsRoot,
    Tab: TRTabsTab,
    Indicator: TRTabsIndicator,
    Panel: TRTabsPanel,
    List: TRTabsList,
  });
  const rootRef = createRef<HTMLDivElement>();
  const listRef = createRef<HTMLDivElement>();
  const tabRef = createRef<HTMLButtonElement>();
  const indicatorRef = createRef<HTMLSpanElement>();
  const panelRef = createRef<HTMLDivElement>();

  await render(
    <TRTabs.Root className="consumer-root" defaultValue="general" ref={rootRef}>
      <TRTabs.List className="consumer-list" ref={listRef}>
        <TRTabs.Tab className="consumer-tab" ref={tabRef} value="general">
          General
        </TRTabs.Tab>
        <TRTabs.Indicator className="consumer-indicator" ref={indicatorRef} />
      </TRTabs.List>
      <TRTabs.Panel
        className="consumer-panel"
        data-testid="general-panel"
        ref={panelRef}
        value="general"
      >
        General settings
      </TRTabs.Panel>
    </TRTabs.Root>,
  );

  expect(rootRef.current).toHaveClass('tr-tabs', 'consumer-root');
  expect(listRef.current).toHaveClass('tr-tabs-list', 'consumer-list');
  expect(listRef.current).toHaveAttribute('role', 'tablist');
  expect(tabRef.current).toHaveClass('tr-tabs-tab', 'consumer-tab');
  expect(indicatorRef.current).toHaveClass('tr-tabs-indicator', 'consumer-indicator');
  expect(panelRef.current).toHaveClass('tr-tabs-panel', 'consumer-panel');
  expect(panelRef.current).toHaveAttribute('data-testid', 'general-panel');
  expect(tabRef.current?.getAttribute('aria-controls')).toBe(panelRef.current?.id);
  expect(panelRef.current?.getAttribute('aria-labelledby')).toBe(tabRef.current?.id);
});

test('uses Base UI keyboard and selection semantics', async () => {
  expect(TRTabs.Root).toBe(TRTabsRoot);
  await render(
    <TRTabs.Root defaultValue="general" uiSize="lg">
      <TRTabs.List>
        <TRTabs.Tab value="general">General</TRTabs.Tab>
        <TRTabs.Tab value="network">Network</TRTabs.Tab>
      </TRTabs.List>
      <TRTabs.Panel value="general">General settings</TRTabs.Panel>
      <TRTabs.Panel value="network">Network settings</TRTabs.Panel>
    </TRTabs.Root>,
  );
  const triggers = document.querySelectorAll<HTMLButtonElement>('.tr-tabs-tab');
  expect(triggers[0]?.getAttribute('aria-selected')).toBe('true');
  triggers[1]?.click();
  await expect.poll(() => triggers[1]?.getAttribute('aria-selected')).toBe('true');
  expect(document.querySelector<HTMLElement>('.tr-tabs')?.dataset['uiSize']).toBe('lg');

  const list = document.querySelector<HTMLElement>('.tr-tabs-list');
  expect(list).not.toBeNull();
  expect(getComputedStyle(list as HTMLElement).gap).toBe('0px');
  expect(getComputedStyle(list as HTMLElement).overflowY).toBe('hidden');
});

test('preserves controlled nullable selection and list configuration', async () => {
  function ControlledTabs() {
    const [value, setValue] = useState<string | null>(null);

    return (
      <>
        <TRTabs.Root
          aria-label="Settings"
          onValueChange={(nextValue) =>
            setValue(nextValue === null ? null : String(nextValue))
          }
          orientation="vertical"
          value={value}
        >
          <TRTabs.List activateOnFocus loopFocus={false}>
            <TRTabs.Tab value="general">General</TRTabs.Tab>
            <TRTabs.Tab value="network">Network</TRTabs.Tab>
          </TRTabs.List>
          <TRTabs.Panel value="general">General settings</TRTabs.Panel>
          <TRTabs.Panel value="network">Network settings</TRTabs.Panel>
        </TRTabs.Root>
        <output>{value ?? 'none'}</output>
      </>
    );
  }

  await render(<ControlledTabs />);
  const list = document.querySelector<HTMLElement>('.tr-tabs-list');
  const network = [
    ...document.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  ].find((tab) => tab.textContent === 'Network');
  expect(list?.getAttribute('aria-orientation')).toBe('vertical');
  expect(document.querySelector('output')?.textContent).toBe('none');
  network?.click();
  await expect
    .poll(() => document.querySelector('output')?.textContent)
    .toBe('network');
  expect(network?.getAttribute('aria-selected')).toBe('true');
});

test('uses manual keyboard activation, blocks disabled tabs, and renders its indicator', async () => {
  await render(
    <TRTabs.Root defaultValue="general">
      <TRTabs.List activateOnFocus={false} loopFocus={false}>
        <TRTabs.Tab value="general">General</TRTabs.Tab>
        <TRTabs.Tab disabled value="locked">
          Locked
        </TRTabs.Tab>
        <TRTabs.Tab value="advanced">Advanced</TRTabs.Tab>
        <TRTabs.Indicator />
      </TRTabs.List>
      <TRTabs.Panel value="general">General settings</TRTabs.Panel>
      <TRTabs.Panel value="advanced">Advanced settings</TRTabs.Panel>
    </TRTabs.Root>,
  );

  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  tabs[0]?.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(tabs[1]);
  expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
  await userEvent.keyboard('{Enter}');
  expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(tabs[2]);
  await userEvent.keyboard('{Enter}');
  await expect.poll(() => tabs[2]?.getAttribute('aria-selected')).toBe('true');
  expect(document.querySelector('.tr-tabs-indicator')).not.toBeNull();
});

test('18-19 uses divider borders while retaining focus-visible without a default indicator', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <TRTabs.Root defaultValue="overview">
      <TRTabs.List aria-label="Rack sections">
        <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
        <TRTabs.Tab value="events">Events</TRTabs.Tab>
      </TRTabs.List>
      <TRTabs.Panel value="overview">Overview panel</TRTabs.Panel>
      <TRTabs.Panel value="events">Events panel</TRTabs.Panel>
    </TRTabs.Root>,
  );
  const list = document.querySelector<HTMLElement>('.tr-tabs-list');
  const selected = document.querySelector<HTMLElement>('.tr-tabs-tab[data-active]');
  const probe = document.createElement('div');
  probe.style.color = 'var(--tinyrack-border)';
  document.body.append(probe);
  expect(getComputedStyle(list as HTMLElement).borderBottomColor).toBe(
    getComputedStyle(probe).color,
  );
  expect(getComputedStyle(selected as HTMLElement).borderTopColor).toBe(
    getComputedStyle(probe).color,
  );
  expect(document.querySelector('.tr-tabs-indicator')).toBeNull();
  document.body.tabIndex = -1;
  document.body.focus();
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toBe(selected);
  expect(
    Array.from(document.styleSheets).some((sheet) =>
      Array.from(sheet.cssRules).some((rule) =>
        rule.cssText.includes('.tr-tabs-tab:focus-visible'),
      ),
    ),
  ).toBe(true);
  probe.remove();
  delete document.documentElement.dataset['theme'];
});

test('keeps the focus indicator inside a horizontally scrollable tab list', async () => {
  await render(
    <TRTabs.Root defaultValue="overview">
      <TRTabs.List aria-label="Deployment sections">
        <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
        <TRTabs.Tab value="network">Network</TRTabs.Tab>
      </TRTabs.List>
      <TRTabs.Panel value="overview">Overview panel</TRTabs.Panel>
      <TRTabs.Panel value="network">Network panel</TRTabs.Panel>
    </TRTabs.Root>,
  );
  const list = document.querySelector<HTMLElement>('.tr-tabs-list');
  const selected = document.querySelector<HTMLButtonElement>(
    '.tr-tabs-tab[data-active]',
  );

  expect(getComputedStyle(list as HTMLElement).overflowX).toBe('auto');
  document.body.tabIndex = -1;
  document.body.focus();
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toBe(selected);
  expect(getComputedStyle(selected as HTMLElement).outlineOffset).toBe('-2px');
  document.body.removeAttribute('tabindex');
});

test('selects the first enabled tab when uncontrolled and supports automatic vertical focus', async () => {
  await render(
    <TRTabs.Root orientation="vertical">
      <TRTabs.List activateOnFocus aria-label="Rack sections" loopFocus={false}>
        <TRTabs.Tab disabled value="locked">
          Locked
        </TRTabs.Tab>
        <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
        <TRTabs.Tab value="network">Network</TRTabs.Tab>
      </TRTabs.List>
      <TRTabs.Panel value="overview">Overview panel</TRTabs.Panel>
      <TRTabs.Panel value="network">Network panel</TRTabs.Panel>
    </TRTabs.Root>,
  );
  const overview = document.querySelector<HTMLButtonElement>(
    '[role="tab"][aria-label="Overview"], [role="tab"]:nth-of-type(2)',
  ) as HTMLButtonElement;
  const network = document.querySelectorAll<HTMLButtonElement>(
    '[role="tab"]',
  )[2] as HTMLButtonElement;

  expect(overview).toHaveAttribute('aria-selected', 'true');
  overview.focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(network).toHaveFocus();
  await expect.poll(() => network.getAttribute('aria-selected')).toBe('true');
  await userEvent.keyboard('{ArrowDown}');
  expect(network).toHaveFocus();
  await userEvent.keyboard('{Home}');
  expect(document.querySelector('[role="tab"]')).toHaveFocus();
});

test('applies all sizes, consumer tokens, and indicator geometry', async () => {
  await render(
    <TRTabs.Root
      defaultValue="general"
      style={
        {
          '--tr-tabs-indicator-background': 'rgb(1, 2, 3)',
          '--tr-tabs-panel-padding': '7px',
        } as CSSProperties
      }
      uiSize="sm"
    >
      <TRTabs.List>
        <TRTabs.Tab value="general">General</TRTabs.Tab>
        <TRTabs.Tab value="network">Network</TRTabs.Tab>
        <TRTabs.Indicator />
      </TRTabs.List>
      <TRTabs.Panel value="general">General panel</TRTabs.Panel>
      <TRTabs.Panel value="network">Network panel</TRTabs.Panel>
    </TRTabs.Root>,
  );
  const root = document.querySelector<HTMLElement>('.tr-tabs');
  const tab = document.querySelector<HTMLButtonElement>(
    '[role="tab"]',
  ) as HTMLButtonElement;
  const indicator = document.querySelector<HTMLElement>('.tr-tabs-indicator');
  const panel = document.querySelector<HTMLElement>('[role="tabpanel"]') as HTMLElement;
  const smallHeight = getComputedStyle(tab).height;

  expect(getComputedStyle(indicator as HTMLElement).backgroundColor).toBe(
    'rgb(1, 2, 3)',
  );
  expect(getComputedStyle(panel).padding).toBe('7px');
  await expect
    .poll(() => getComputedStyle(indicator as HTMLElement).width)
    .not.toBe('0px');
  root?.setAttribute('data-ui-size', 'md');
  const mediumHeight = getComputedStyle(tab).height;
  root?.setAttribute('data-ui-size', 'lg');
  expect(Number.parseFloat(smallHeight)).toBeLessThan(Number.parseFloat(mediumHeight));
  expect(Number.parseFloat(mediumHeight)).toBeLessThan(
    Number.parseFloat(getComputedStyle(tab).height),
  );
});

test('server-renders and hydrates selected state without recovery', async () => {
  const fixture = (
    <TRTabs.Root defaultValue="general">
      <TRTabs.List aria-label="Hydrated settings">
        <TRTabs.Tab value="general">General</TRTabs.Tab>
        <TRTabs.Tab value="network">Network</TRTabs.Tab>
        <TRTabs.Indicator />
      </TRTabs.List>
      <TRTabs.Panel value="general">General settings</TRTabs.Panel>
      <TRTabs.Panel value="network">Network settings</TRTabs.Panel>
    </TRTabs.Root>
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
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toBe(
    'General',
  );
  host.querySelector<HTMLButtonElement>('[role="tab"]:nth-of-type(2)')?.click();
  await expect
    .poll(() => host.querySelector('[role="tab"][aria-selected="true"]')?.textContent)
    .toBe('Network');

  await act(async () => root.unmount());
  host.remove();
});
