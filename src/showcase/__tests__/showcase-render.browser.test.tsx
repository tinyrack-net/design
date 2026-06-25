import '@mantine/core/styles.css';
import '../showcase.css';
import '../../mantine/styles.css';
import '../../daisyui/theme.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TinyrackMantineProvider } from '../../mantine/index.js';
import {
  DaisyUiShowcaseGallery,
  daisyUiShowcaseEntries,
  MantineShowcaseGallery,
  mantineShowcaseEntries,
  SingleShowcaseStory,
} from '../index.js';

test('renders every Mantine showcase component in browser mode', async () => {
  const screen = await render(
    <TinyrackMantineProvider>
      <MantineShowcaseGallery />
    </TinyrackMantineProvider>,
  );

  await expect.element(screen.getByText('Mantine components')).toBeVisible();
  expect(document.querySelectorAll('[data-showcase-library="mantine"]')).toHaveLength(
    mantineShowcaseEntries.length,
  );
});

test('renders every daisyUI showcase component in browser mode', async () => {
  document.documentElement.dataset.theme = 'tinyrack-light';
  const screen = await render(<DaisyUiShowcaseGallery />);

  await expect.element(screen.getByText('daisyUI components')).toBeVisible();
  expect(document.querySelectorAll('[data-showcase-library="daisyui"]')).toHaveLength(
    daisyUiShowcaseEntries.length,
  );
});

test('renders scenario variant matrices for individual component stories', async () => {
  document.documentElement.dataset.theme = 'tinyrack-dark';
  const mantineButton = mantineShowcaseEntries.find(
    (entry) => entry.id === 'mantine-button',
  );
  const daisyButton = daisyUiShowcaseEntries.find(
    (entry) => entry.id === 'daisyui-button',
  );

  expect(mantineButton).toBeDefined();
  expect(daisyButton).toBeDefined();

  if (!mantineButton || !daisyButton) {
    throw new Error('Expected button showcase entries to exist');
  }

  const screen = await render(
    <TinyrackMantineProvider>
      <SingleShowcaseStory
        entry={mantineButton}
        library="mantine"
        scenarioId="variants"
      />
      <SingleShowcaseStory
        entry={daisyButton}
        library="daisyui"
        scenarioId="variants"
      />
    </TinyrackMantineProvider>,
  );

  await expect.element(screen.getByText('Mantine Button variants')).toBeVisible();
  await expect.element(screen.getByText('daisyUI button variants')).toBeVisible();
  expect(document.querySelectorAll('[data-showcase-scenario="variants"]')).toHaveLength(
    2,
  );
});
