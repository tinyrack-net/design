import { useState } from 'react';
import '../../core/core.css';
import './tabs.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Tabs, TabsList, TabsPanel, TabsTrigger } from './react.js';

const themeDatasetKey = 'theme';

function computedStyleFor(element: Element) {
  return getComputedStyle(element);
}

function tabByText(text: string) {
  const tab = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  ).find((element) => element.textContent === text);

  if (!tab) {
    throw new Error(`Unable to find tab: ${text}`);
  }

  return tab;
}

function panelByText(text: string) {
  const panel = Array.from(
    document.querySelectorAll<HTMLElement>('[role="tabpanel"]'),
  ).find((element) => element.textContent?.includes(text));

  if (!panel) {
    throw new Error(`Unable to find panel: ${text}`);
  }

  return panel;
}

function pressKey(element: Element, key: string) {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key,
    }),
  );
}

function waitForReact() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function RackTabs({
  activationMode = 'automatic',
  defaultValue = 'overview',
  orientation = 'horizontal',
}: {
  activationMode?: 'automatic' | 'manual';
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
}) {
  return (
    <Tabs
      activationMode={activationMode}
      defaultValue={defaultValue}
      orientation={orientation}
    >
      <TabsList aria-label="Rack sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger disabled value="metrics">
          Metrics
        </TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>
      <TabsPanel value="overview">Overview panel</TabsPanel>
      <TabsPanel value="metrics">Metrics panel</TabsPanel>
      <TabsPanel value="logs">Logs panel</TabsPanel>
    </Tabs>
  );
}

test('Tabs renders the CSS-first contract with defaults', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(<RackTabs />);

  const tabs = document.querySelector<HTMLElement>('.tr-tabs');
  const list = document.querySelector<HTMLElement>('[role="tablist"]');
  const overviewTab = tabByText('Overview');
  const logsTab = tabByText('Logs');
  const overviewPanel = panelByText('Overview panel');
  const logsPanel = panelByText('Logs panel');

  if (tabs === null || list === null) {
    throw new Error('Unable to find Tabs root or list.');
  }

  await expect.element(overviewTab).toBeVisible();
  await expect.element(tabs).toHaveAttribute('data-size', 'md');
  await expect.element(tabs).toHaveAttribute('data-orientation', 'horizontal');
  await expect.element(list).toHaveAttribute('aria-label', 'Rack sections');
  await expect.element(overviewTab).toHaveAttribute('aria-selected', 'true');
  await expect.element(logsTab).toHaveAttribute('aria-selected', 'false');
  expect(overviewTab.tabIndex).toBe(0);
  expect(logsTab.tabIndex).toBe(-1);
  expect(overviewPanel.hidden).toBe(false);
  expect(logsPanel.hidden).toBe(true);

  const triggerStyles = computedStyleFor(overviewTab);
  const tabsStyles = computedStyleFor(tabs);
  const panelStyles = computedStyleFor(overviewPanel);

  expect(tabsStyles.columnGap).toBe('0px');
  expect(tabsStyles.maxWidth).toBe('100%');
  expect(triggerStyles.height).toBe('40px');
  expect(triggerStyles.paddingLeft).toBe('16px');
  expect(triggerStyles.fontSize).toBe('14px');
  expect(triggerStyles.fontWeight).toBe('700');
  expect(triggerStyles.borderBottomColor).toBe(panelStyles.backgroundColor);
  expect(panelStyles.paddingTop).toBe('16px');
  expect(panelStyles.borderTopLeftRadius).toBe('0px');
  expect(panelStyles.borderTopRightRadius).toBe('0px');
  expect(panelStyles.borderBottomLeftRadius).toBe('6px');
  expect(panelStyles.borderBottomRightRadius).toBe('6px');
});

test('Tabs can be controlled with onValueChange', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  function ControlledTabs() {
    const [value, setValue] = useState('overview');

    return (
      <Tabs value={value} onValueChange={setValue}>
        <TabsList aria-label="Rack sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsPanel value="overview">Overview panel</TabsPanel>
        <TabsPanel value="logs">Logs panel</TabsPanel>
      </Tabs>
    );
  }

  await render(<ControlledTabs />);
  const logsTab = tabByText('Logs');

  logsTab.click();
  await waitForReact();

  await expect.element(logsTab).toHaveAttribute('aria-selected', 'true');
  expect(panelByText('Overview panel').hidden).toBe(true);
  expect(panelByText('Logs panel').hidden).toBe(false);
});

test('Tabs automatic activation moves focus, wraps, and skips disabled tabs', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(<RackTabs />);

  const overviewTab = tabByText('Overview');
  const logsTab = tabByText('Logs');

  overviewTab.focus();
  pressKey(overviewTab, 'ArrowRight');
  await waitForReact();

  expect(document.activeElement).toBe(logsTab);
  await expect.element(logsTab).toHaveAttribute('aria-selected', 'true');
  expect(panelByText('Logs panel').hidden).toBe(false);

  pressKey(logsTab, 'ArrowRight');
  await waitForReact();

  expect(document.activeElement).toBe(overviewTab);
  await expect.element(overviewTab).toHaveAttribute('aria-selected', 'true');

  pressKey(overviewTab, 'End');
  await waitForReact();

  expect(document.activeElement).toBe(logsTab);
  await expect.element(logsTab).toHaveAttribute('aria-selected', 'true');
});

test('Tabs manual activation separates roving focus from selection', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(<RackTabs activationMode="manual" />);

  const overviewTab = tabByText('Overview');
  const logsTab = tabByText('Logs');

  overviewTab.focus();
  pressKey(overviewTab, 'ArrowRight');
  await waitForReact();

  expect(document.activeElement).toBe(logsTab);
  await expect.element(overviewTab).toHaveAttribute('aria-selected', 'true');
  await expect.element(logsTab).toHaveAttribute('aria-selected', 'false');

  pressKey(logsTab, 'Enter');
  await waitForReact();

  await expect.element(logsTab).toHaveAttribute('aria-selected', 'true');
  expect(panelByText('Logs panel').hidden).toBe(false);

  pressKey(logsTab, 'Home');
  await waitForReact();
  pressKey(overviewTab, ' ');
  await waitForReact();

  await expect.element(overviewTab).toHaveAttribute('aria-selected', 'true');
});

test('Tabs vertical orientation uses vertical arrow keys and aria-orientation', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  await render(<RackTabs defaultValue="logs" orientation="vertical" />);

  const list = document.querySelector<HTMLElement>('[role="tablist"]');
  const overviewTab = tabByText('Overview');
  const overviewPanel = panelByText('Overview panel');
  const logsTab = tabByText('Logs');
  const logsPanel = panelByText('Logs panel');

  if (list === null) {
    throw new Error('Unable to find tab list.');
  }

  await expect.element(list).toHaveAttribute('aria-orientation', 'vertical');
  expect(computedStyleFor(logsTab).borderRightColor).toBe(
    computedStyleFor(logsPanel).backgroundColor,
  );

  logsTab.focus();
  pressKey(logsTab, 'ArrowUp');
  await waitForReact();

  expect(document.activeElement).toBe(overviewTab);
  await expect.element(overviewTab).toHaveAttribute('aria-selected', 'true');
  expect(overviewPanel.hidden).toBe(false);
  expect(computedStyleFor(overviewTab).height).toBe('40px');
  expect(computedStyleFor(overviewPanel).borderTopLeftRadius).toBe('0px');
  expect(computedStyleFor(overviewPanel).borderTopRightRadius).toBe('6px');
});
