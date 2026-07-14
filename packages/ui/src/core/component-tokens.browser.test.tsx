import '../components/button/button.css';
import '../components/field/field.css';
import '../components/tabs/tabs.css';
import './core.css';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { Button } from '../components/button/index.js';
import { Field } from '../components/field/index.js';
import { Tabs } from '../components/tabs/index.js';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('style');
});

function renderSharedControls() {
  return render(
    <div>
      <Button size="md">Deploy</Button>
      <Field.Root>
        <Field.Control aria-label="Rack" />
      </Field.Root>
      <Tabs.Root defaultValue="overview" size="md">
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
      </Tabs.Root>
    </div>,
  );
}

test('Button, Form, and Tabs share the medium control recipe', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-dark';
  await renderSharedControls();

  const button = document.querySelector('.tr-btn');
  const input = document.querySelector('.tr-input');
  const tab = document.querySelector('.tr-tabs-tab');

  for (const control of [button, input, tab]) {
    if (control === null) {
      throw new Error('Unable to find shared control.');
    }

    const styles = getComputedStyle(control);
    expect(styles.height).toBe('40px');
    expect(styles.paddingLeft).toBe('16px');
    expect(styles.fontSize).toBe('14px');
  }
});

test('global foundation overrides flow through every control', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  document.documentElement.style.setProperty('--tinyrack-radius-md', '14px');
  await renderSharedControls();

  expect(
    getComputedStyle(document.querySelector('.tr-btn') as Element).borderRadius,
  ).toBe('14px');
  expect(
    getComputedStyle(document.querySelector('.tr-input') as Element).borderRadius,
  ).toBe('14px');
  expect(
    getComputedStyle(document.querySelector('.tr-tabs-tab') as Element)
      .borderTopLeftRadius,
  ).toBe('14px');
});

test('component recipe overrides remain isolated from the global recipe', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-dark';
  document.documentElement.style.setProperty('--tr-btn-height', '3.5rem');
  await renderSharedControls();

  expect(getComputedStyle(document.querySelector('.tr-btn') as Element).height).toBe(
    '56px',
  );
  expect(getComputedStyle(document.querySelector('.tr-input') as Element).height).toBe(
    '40px',
  );
});
