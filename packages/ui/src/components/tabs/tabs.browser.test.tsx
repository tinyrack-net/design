import './tabs.css';
import { useState } from 'react';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Tabs, TabsRoot } from './index.js';

test('uses Base UI keyboard and selection semantics', async () => {
  expect(Tabs.Root).toBe(TabsRoot);
  await render(
    <Tabs.Root defaultValue="general" size="lg">
      <Tabs.List>
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="network">Network</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="general">General settings</Tabs.Panel>
      <Tabs.Panel value="network">Network settings</Tabs.Panel>
    </Tabs.Root>,
  );
  const triggers = document.querySelectorAll<HTMLButtonElement>('.tr-tabs-tab');
  expect(triggers[0]?.getAttribute('aria-selected')).toBe('true');
  triggers[1]?.click();
  await expect.poll(() => triggers[1]?.getAttribute('aria-selected')).toBe('true');
  expect(document.querySelector<HTMLElement>('.tr-tabs')?.dataset['size']).toBe('lg');

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
        <Tabs.Root
          aria-label="Settings"
          onValueChange={(nextValue) =>
            setValue(nextValue === null ? null : String(nextValue))
          }
          orientation="vertical"
          value={value}
        >
          <Tabs.List activateOnFocus loopFocus={false}>
            <Tabs.Tab value="general">General</Tabs.Tab>
            <Tabs.Tab value="network">Network</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="general">General settings</Tabs.Panel>
          <Tabs.Panel value="network">Network settings</Tabs.Panel>
        </Tabs.Root>
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
    <Tabs.Root defaultValue="general">
      <Tabs.List activateOnFocus={false} loopFocus={false}>
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab disabled value="locked">
          Locked
        </Tabs.Tab>
        <Tabs.Tab value="advanced">Advanced</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="general">General settings</Tabs.Panel>
      <Tabs.Panel value="advanced">Advanced settings</Tabs.Panel>
    </Tabs.Root>,
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
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Rack sections">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="events">Events</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
      <Tabs.Panel value="events">Events panel</Tabs.Panel>
    </Tabs.Root>,
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
