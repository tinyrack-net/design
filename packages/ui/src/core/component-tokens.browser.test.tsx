import '../components/button/button.css';
import '../components/field/field.css';
import '../components/tabs/tabs.css';
import './core.css';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { TRButton } from '../components/button/index.js';
import { TRField } from '../components/field/index.js';
import { TRTabs } from '../components/tabs/index.js';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('style');
});

function renderSharedControls() {
  return render(
    <div>
      <TRButton uiSize="md">Deploy</TRButton>
      <TRField.Root>
        <TRField.Control aria-label="Rack" />
      </TRField.Root>
      <TRTabs.Root defaultValue="overview" uiSize="md">
        <TRTabs.List aria-label="Sections">
          <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
        </TRTabs.List>
        <TRTabs.Panel value="overview">Overview panel</TRTabs.Panel>
      </TRTabs.Root>
    </div>,
  );
}

test('TRButton, TRForm, and TRTabs share the medium control recipe', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-dark';
  await renderSharedControls();

  const button = document.querySelector('.tr-btn');
  const input = document.querySelector('.tr-field-control');
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
    getComputedStyle(document.querySelector('.tr-field-control') as Element)
      .borderRadius,
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
  expect(
    getComputedStyle(document.querySelector('.tr-field-control') as Element).height,
  ).toBe('40px');
});
