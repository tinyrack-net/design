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
  SingleComponentStory,
  SingleShowcaseStory,
} from '../index.js';

function getIndividualStoryRoot(entryId: string) {
  const root = document.querySelector(`[data-showcase-entry-id="${entryId}"]`);

  expect(root).not.toBeNull();

  return root as HTMLElement;
}

function expectMinimalIndividualStory(root: HTMLElement) {
  expect(
    root.classList.contains('tinyrack-component-story') ||
      root.classList.contains('tinyrack-showcase-single'),
  ).toBe(true);
  expect(root.classList.contains('tinyrack-showcase-card')).toBe(false);
  expect(root.querySelector('.tinyrack-showcase-card')).toBeNull();
  expect(root.querySelector('.tinyrack-showcase-card__header')).toBeNull();
  expect(root.querySelector('.tinyrack-showcase-card__category')).toBeNull();
  expect(root.querySelector('.tinyrack-showcase-card__preview')).toBeNull();
  expect(root.querySelector('.tinyrack-showcase-card__description')).toBeNull();
}

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
        storyKind="variants"
      />
      <SingleShowcaseStory entry={daisyButton} library="daisyui" storyKind="variants" />
    </TinyrackMantineProvider>,
  );

  await expect.element(screen.getByText('Mantine Button variants')).toBeVisible();
  await expect.element(screen.getByText('daisyUI button variants')).toBeVisible();
  expect(
    document.querySelectorAll('[data-showcase-story-kind="variants"]'),
  ).toHaveLength(2);
});

test('renders individual component stories as minimal previews without gallery card chrome', async () => {
  document.documentElement.dataset.theme = 'tinyrack-dark';
  const mantineButton = mantineShowcaseEntries.find(
    (entry) => entry.id === 'mantine-button',
  );
  const daisyButton = daisyUiShowcaseEntries.find(
    (entry) => entry.id === 'daisyui-button',
  );

  if (!mantineButton || !daisyButton) {
    throw new Error('Expected button showcase entries to exist');
  }

  await render(
    <TinyrackMantineProvider>
      <SingleComponentStory entry={mantineButton} library="mantine" />
      <SingleComponentStory entry={daisyButton} library="daisyui" />
    </TinyrackMantineProvider>,
  );

  for (const entryId of ['mantine-button', 'daisyui-button']) {
    const root = getIndividualStoryRoot(entryId);

    expect(root.dataset.showcaseStoryKind).toBe('default');
    expectMinimalIndividualStory(root);
    expect(root.textContent?.trim().length).toBeGreaterThan(0);
  }
});

test('keeps simple preview components readable instead of stretched or viewport-tall', async () => {
  document.documentElement.dataset.theme = 'tinyrack-dark';
  const daisyButton = daisyUiShowcaseEntries.find(
    (entry) => entry.id === 'daisyui-button',
  );
  const daisyDrawer = daisyUiShowcaseEntries.find(
    (entry) => entry.id === 'daisyui-drawer',
  );
  const mantineAppShell = mantineShowcaseEntries.find(
    (entry) => entry.id === 'mantine-appshell',
  );

  if (!daisyButton || !daisyDrawer || !mantineAppShell) {
    throw new Error('Expected showcase entries to exist');
  }

  const screen = await render(
    <TinyrackMantineProvider>
      <SingleComponentStory entry={daisyButton} library="daisyui" />
      <SingleComponentStory entry={daisyDrawer} library="daisyui" />
      <SingleComponentStory entry={mantineAppShell} library="mantine" />
    </TinyrackMantineProvider>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Apply config' }))
    .toBeVisible();
  const firstPreview = getIndividualStoryRoot('daisyui-button');
  const button = firstPreview.querySelector('.btn');
  const previewRect = firstPreview.getBoundingClientRect();
  const buttonRect = button?.getBoundingClientRect();

  expect(previewRect.width).toBeGreaterThan(300);
  expect(buttonRect?.width).toBeLessThan(previewRect.width * 0.5);

  const tallPreviews = [
    ...document.querySelectorAll(
      '.tinyrack-component-story, .tinyrack-showcase-single',
    ),
  ]
    .map((preview) => preview.getBoundingClientRect().height)
    .filter((height) => height > 420);

  expect(tallPreviews).toHaveLength(0);
});

test('keeps variant cells readable without internal clipping', async () => {
  document.documentElement.dataset.theme = 'tinyrack-dark';
  const daisyDropdown = daisyUiShowcaseEntries.find(
    (entry) => entry.id === 'daisyui-dropdown',
  );
  const mantineIndicator = mantineShowcaseEntries.find(
    (entry) => entry.id === 'mantine-indicator',
  );

  if (!daisyDropdown || !mantineIndicator) {
    throw new Error('Expected showcase entries to exist');
  }

  await render(
    <TinyrackMantineProvider>
      <SingleShowcaseStory
        entry={daisyDropdown}
        library="daisyui"
        storyKind="variants"
      />
      <SingleShowcaseStory
        entry={mantineIndicator}
        library="mantine"
        storyKind="variants"
      />
    </TinyrackMantineProvider>,
  );

  const clippedCells = [...document.querySelectorAll('.tinyrack-variant-cell')].filter(
    (cell) =>
      cell.scrollWidth > cell.clientWidth + 8 ||
      cell.scrollHeight > cell.clientHeight + 8,
  );

  expect(clippedCells).toHaveLength(0);
});

test('renders layout-sensitive components at useful story widths', async () => {
  document.documentElement.dataset.theme = 'tinyrack-dark';
  const entries = [
    {
      id: 'mantine-stepper',
      library: 'mantine' as const,
      selector: '.mantine-Stepper-root',
    },
    {
      id: 'mantine-slider',
      library: 'mantine' as const,
      selector: '.mantine-Slider-root',
    },
    {
      id: 'mantine-rangeslider',
      library: 'mantine' as const,
      selector: '.mantine-RangeSlider-root',
    },
    { id: 'mantine-tabs', library: 'mantine' as const, selector: '.mantine-Tabs-root' },
    { id: 'daisyui-steps', library: 'daisyui' as const, selector: '.steps' },
  ].map((spec) => ({
    ...spec,
    entry:
      spec.library === 'mantine'
        ? mantineShowcaseEntries.find((entry) => entry.id === spec.id)
        : daisyUiShowcaseEntries.find((entry) => entry.id === spec.id),
  }));

  const resolvedEntries = entries.map((spec) => {
    if (!spec.entry) {
      throw new Error(`Expected ${spec.id} showcase entry to exist`);
    }

    return { ...spec, entry: spec.entry };
  });

  await render(
    <TinyrackMantineProvider>
      {resolvedEntries.map((spec) => (
        <SingleComponentStory key={spec.id} entry={spec.entry} library={spec.library} />
      ))}
    </TinyrackMantineProvider>,
  );

  for (const spec of resolvedEntries) {
    const preview = getIndividualStoryRoot(spec.id);
    const component = preview.querySelector(spec.selector);
    const previewRect = preview.getBoundingClientRect();
    const componentRect = component?.getBoundingClientRect();

    expect(previewRect.width).toBeGreaterThan(300);
    expect(componentRect?.width).toBeGreaterThan(280);
    expect(componentRect?.width).toBeLessThanOrEqual(previewRect.width);
  }
});
