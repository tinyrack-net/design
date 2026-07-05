import '@mantine/core/styles.css';
import '../mantine/styles.css';
import '../daisyui/theme.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TinyrackMantineProvider } from '../mantine/index.js';
import {
  DaisyUiShowcaseGallery,
  daisyUiShowcaseEntries,
  MantineShowcaseGallery,
  mantineShowcaseEntries,
  SingleComponentStory,
  SingleShowcaseStory,
} from './index.js';

const themeDatasetKey = 'theme';
const showcaseStoryKindDatasetKey = 'showcaseStoryKind';
const minimumDistinguishableTextContrastRatio = 2;

type RgbaColor = {
  a: number;
  b: number;
  g: number;
  r: number;
};

type ContrastFailure = {
  background: string;
  customProperties: string;
  foreground: string;
  parent: string;
  ratio: number;
  scheme: string;
  selector: string;
  text: string;
};

async function waitForMantineColorScheme(colorScheme: 'dark' | 'light') {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (
      document.documentElement.getAttribute('data-mantine-color-scheme') === colorScheme
    ) {
      return;
    }

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  expect(document.documentElement.getAttribute('data-mantine-color-scheme')).toBe(
    colorScheme,
  );
}

function parseRgbaColor(value: string): RgbaColor | null {
  const hexColor = value.trim().match(/^#([0-9a-f]{6})$/i)?.[1];

  if (hexColor) {
    return {
      a: 1,
      b: Number.parseInt(hexColor.slice(4, 6), 16),
      g: Number.parseInt(hexColor.slice(2, 4), 16),
      r: Number.parseInt(hexColor.slice(0, 2), 16),
    };
  }

  const channelsText = value.match(/rgba?\(([^)]+)\)/)?.[1];

  if (!channelsText) {
    return null;
  }

  const channels = channelsText
    .split(',')
    .map((channel) => Number.parseFloat(channel.trim()));
  const [r, g, b, a = 1] = channels;

  if (r === undefined || g === undefined || b === undefined) {
    return null;
  }

  return { a, b, g, r };
}

function blendRgbaColor(foreground: RgbaColor, background: RgbaColor): RgbaColor {
  const alpha = foreground.a + background.a * (1 - foreground.a);

  if (alpha === 0) {
    return { a: 1, b: 255, g: 255, r: 255 };
  }

  return {
    a: alpha,
    b:
      (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) /
      alpha,
    g:
      (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) /
      alpha,
    r:
      (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) /
      alpha,
  };
}

function relativeLuminance({ b, g, r }: RgbaColor) {
  const channelLuminance = (channel: number) => {
    const normalized = channel / 255;

    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

function contrastRatio(foreground: RgbaColor, background: RgbaColor) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);

  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

function formatRgbaColor({ a, b, g, r }: RgbaColor) {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${Number(a.toFixed(2))})`;
}

function effectiveBackgroundColor(element: Element) {
  const backgroundColors: RgbaColor[] = [];
  let current: Element | null = element;

  while (current) {
    const backgroundColor = parseRgbaColor(getComputedStyle(current).backgroundColor);

    if (backgroundColor && backgroundColor.a > 0) {
      backgroundColors.push(backgroundColor);
    }

    current = current.parentElement;
  }

  return backgroundColors
    .reverse()
    .reduce((background, foreground) => blendRgbaColor(foreground, background), {
      a: 1,
      b: 255,
      g: 255,
      r: 255,
    });
}

function getRenderedBackgroundColor(element: Element) {
  const stepperIcon = element.closest(
    '.mantine-Stepper-stepIcon:not([data-completed])',
  );
  const stepperOutlineColor = stepperIcon
    ? parseRgbaColor(
        getComputedStyle(stepperIcon).getPropertyValue('--stepper-outline-color'),
      )
    : null;

  if (stepperOutlineColor) {
    return stepperOutlineColor;
  }

  const activeSegmentedControlLabel = element.closest(
    '.mantine-SegmentedControl-label[data-active]',
  );
  const segmentedControlRoot = activeSegmentedControlLabel?.closest(
    '.mantine-SegmentedControl-root',
  );
  const segmentedControlIndicator = segmentedControlRoot?.querySelector(
    '.mantine-SegmentedControl-indicator',
  );

  if (segmentedControlIndicator) {
    return effectiveBackgroundColor(segmentedControlIndicator);
  }

  return effectiveBackgroundColor(element);
}

function getElementContrastResult(element: Element) {
  const foregroundColor = parseRgbaColor(getComputedStyle(element).color);

  if (!foregroundColor) {
    throw new Error('Expected element foreground color to be rgb or rgba');
  }

  const backgroundColor = getRenderedBackgroundColor(element);

  return {
    background: formatRgbaColor(backgroundColor),
    foreground: formatRgbaColor(foregroundColor),
    ratio: contrastRatio(foregroundColor, backgroundColor),
  };
}

function isVisibleTextElement(element: Element) {
  if (element.closest('[aria-hidden="true"], [hidden]')) {
    return false;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width <= 0.5 || rect.height <= 0.5) {
    return false;
  }

  let current: Element | null = element;

  while (current) {
    const styles = getComputedStyle(current);

    if (
      styles.display === 'none' ||
      styles.visibility === 'hidden' ||
      Number.parseFloat(styles.opacity) === 0
    ) {
      return false;
    }

    current = current.parentElement;
  }

  return true;
}

function describeContrastTarget(element: Element, text: string) {
  const showcaseRoot = element.closest('[data-showcase-entry-id]');
  const entryId = showcaseRoot?.getAttribute('data-showcase-entry-id') ?? 'unknown';
  const className = Array.from(element.classList).slice(0, 3).join('.');
  const elementName = element.tagName.toLowerCase();
  const selector = className ? `${elementName}.${className}` : elementName;

  return `${entryId} ${selector}: "${text.slice(0, 48)}"`;
}

function describeParentElement(element: Element) {
  const parent = element.parentElement;

  if (!parent) {
    return '';
  }

  return [
    parent.tagName.toLowerCase(),
    parent.getAttribute('class'),
    parent.getAttribute('data-active') ? 'data-active' : undefined,
    parent.getAttribute('style') ?? undefined,
  ]
    .filter(Boolean)
    .join(' ');
}

function describeColorSchemeScope(element: Element) {
  const scope = element.closest('[data-mantine-color-scheme]');

  if (!scope) {
    return document.documentElement.getAttribute('data-mantine-color-scheme') ?? '';
  }

  return `${scope.tagName.toLowerCase()} ${scope.getAttribute(
    'data-mantine-color-scheme',
  )}`;
}

function describeCustomProperties(element: Element) {
  const styles = getComputedStyle(element);
  const properties = [
    '--tinyrack-mantine-filled-color',
    '--tinyrack-text',
    '--tinyrack-mantine-stepper-outline-color',
    '--stepper-outline-color',
    '--sc-label-color',
  ];

  return properties
    .map((property) => `${property}=${styles.getPropertyValue(property).trim()}`)
    .filter((value) => !value.endsWith('='))
    .join('; ');
}

function collectLowContrastText(root: ParentNode, minimumRatio: number) {
  const failures: ContrastFailure[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    const text = current.textContent?.replace(/\s+/g, ' ').trim();
    const element = current.parentElement;

    if (text && element && isVisibleTextElement(element)) {
      const contrast = getElementContrastResult(element);

      if (contrast.ratio < minimumRatio) {
        failures.push({
          background: contrast.background,
          customProperties: describeCustomProperties(element),
          foreground: contrast.foreground,
          parent: describeParentElement(element),
          ratio: Number(contrast.ratio.toFixed(2)),
          scheme: describeColorSchemeScope(element),
          selector: describeContrastTarget(element, text),
          text,
        });
      }
    }

    current = walker.nextNode();
  }

  return failures.sort((a, b) => a.ratio - b.ratio);
}

function getIndividualStoryRoot(entryId: string) {
  const root = document.querySelector(`[data-showcase-entry-id="${entryId}"]`);

  expect(root).not.toBeNull();

  return root as HTMLElement;
}

function expectMinimalIndividualStory(root: HTMLElement) {
  expect(root.getAttribute('data-showcase-entry-id')).toBeTruthy();
  expect(root.getAttribute('data-showcase-story-kind')).toBeTruthy();
  expect(root.getAttribute('data-showcase-card')).toBeNull();
  expect(root.querySelector('[data-showcase-card="true"]')).toBeNull();
}

function getRequiredElement(root: ParentNode, selector: string) {
  const element = root.querySelector(selector);

  expect(element).not.toBeNull();

  return element as HTMLElement;
}

function expectElementRectInside(element: HTMLElement, container: HTMLElement) {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  expect(elementRect.top).toBeGreaterThanOrEqual(containerRect.top - 1);
  expect(elementRect.left).toBeGreaterThanOrEqual(containerRect.left - 1);
  expect(elementRect.right).toBeLessThanOrEqual(containerRect.right + 1);
  expect(elementRect.bottom).toBeLessThanOrEqual(containerRect.bottom + 1);
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

test.each([
  { colorScheme: 'dark', dataTheme: 'tinyrack-dark' },
  { colorScheme: 'light', dataTheme: 'tinyrack-light' },
] as const)('keeps all Mantine showcase text distinguishable in $colorScheme mode', async ({
  colorScheme,
  dataTheme,
}) => {
  document.documentElement.dataset[themeDatasetKey] = dataTheme;
  const root = document.createElement('section');
  document.body.append(root);
  const screen = await render(
    <TinyrackMantineProvider forceColorScheme={colorScheme}>
      <MantineShowcaseGallery />
    </TinyrackMantineProvider>,
    { container: root },
  );

  await expect.element(screen.getByText('Mantine components')).toBeVisible();
  await waitForMantineColorScheme(colorScheme);
  const failures = [
    ...root.querySelectorAll('[data-showcase-library="mantine"]'),
  ].flatMap((showcaseRoot) =>
    collectLowContrastText(showcaseRoot, minimumDistinguishableTextContrastRatio),
  );

  expect(failures.slice(0, 10)).toEqual([]);
});

test('renders every daisyUI showcase component in browser mode', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  const screen = await render(<DaisyUiShowcaseGallery />);

  await expect.element(screen.getByText('daisyUI components')).toBeVisible();
  expect(document.querySelectorAll('[data-showcase-library="daisyui"]')).toHaveLength(
    daisyUiShowcaseEntries.length,
  );
});

test('renders scenario variant matrices for individual component stories', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
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
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
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

    expect(root.dataset[showcaseStoryKindDatasetKey]).toBe('default');
    expectMinimalIndividualStory(root);
    expect(root.textContent?.trim().length).toBeGreaterThan(0);
  }
});

test('keeps simple preview components readable instead of stretched or viewport-tall', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  const daisyButton = daisyUiShowcaseEntries.find(
    (entry) => entry.id === 'daisyui-button',
  );
  const daisyDrawer = daisyUiShowcaseEntries.find(
    (entry) => entry.id === 'daisyui-drawer',
  );
  const mantineAffix = mantineShowcaseEntries.find(
    (entry) => entry.id === 'mantine-affix',
  );
  const mantineAppShell = mantineShowcaseEntries.find(
    (entry) => entry.id === 'mantine-appshell',
  );

  if (!daisyButton || !daisyDrawer || !mantineAffix || !mantineAppShell) {
    throw new Error('Expected showcase entries to exist');
  }

  const screen = await render(
    <TinyrackMantineProvider>
      <SingleComponentStory entry={daisyButton} library="daisyui" />
      <SingleComponentStory entry={daisyDrawer} library="daisyui" />
      <SingleComponentStory entry={mantineAffix} library="mantine" />
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
    ...document.querySelectorAll('[data-showcase-entry-id][data-showcase-story-kind]'),
  ]
    .map((preview) => preview.getBoundingClientRect().height)
    .filter((height) => height > 420);

  expect(tallPreviews).toHaveLength(0);

  const appShellRoot = getIndividualStoryRoot('mantine-appshell');
  const appShellFrame = getRequiredElement(
    appShellRoot,
    '.mantine-AppShell-root',
  ).parentElement;
  const appShellNavbar = getRequiredElement(appShellRoot, '.mantine-AppShell-navbar');

  expect(appShellFrame).not.toBeNull();
  expect(getComputedStyle(appShellNavbar).position).toBe('absolute');
  expectElementRectInside(appShellNavbar, appShellFrame as HTMLElement);

  const affixRoot = getIndividualStoryRoot('mantine-affix');
  const tailLogsButton = [...affixRoot.querySelectorAll('button')].find(
    (button) => button.textContent?.trim() === 'Tail logs',
  );

  expect(tailLogsButton).toBeDefined();
  expectElementRectInside(tailLogsButton as HTMLElement, affixRoot);

  const escapedFixedOverlays = [
    ...document.querySelectorAll('.mantine-AppShell-navbar, .mantine-Affix-root'),
  ]
    .filter((element) => {
      const rect = element.getBoundingClientRect();

      return (
        getComputedStyle(element).position === 'fixed' &&
        rect.width > 1 &&
        rect.height > 1
      );
    })
    .map((element) => ({
      className: element.getAttribute('class'),
      text: element.textContent?.trim(),
    }));

  expect(escapedFixedOverlays).toEqual([]);
});

test('keeps variant cells readable without internal clipping', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
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

  const clippedCells = [
    ...document.querySelectorAll('[data-showcase-variant-cell="true"]'),
  ].filter(
    (cell) =>
      cell.scrollWidth > cell.clientWidth + 8 ||
      cell.scrollHeight > cell.clientHeight + 8,
  );

  expect(clippedCells).toHaveLength(0);
});

test('renders layout-sensitive components at useful story widths', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
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
