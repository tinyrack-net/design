import '@mantine/core/styles.css';
import './styles.css';
import {
  Badge,
  Button,
  Card,
  Chip,
  Indicator,
  Pagination,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TinyrackMantineProvider } from './index.js';

type RgbaColor = {
  a: number;
  b: number;
  g: number;
  r: number;
};

const minimumTextContrastRatio = 4.5;

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

function getElementContrastRatio(element: Element) {
  const foregroundColor = parseRgbaColor(getComputedStyle(element).color);

  if (!foregroundColor) {
    throw new Error('Expected element foreground color to be rgb or rgba');
  }

  return contrastRatio(foregroundColor, effectiveBackgroundColor(element));
}

function expectReadableContrast(selector: string, label: string) {
  const element = document.querySelector(selector);

  expect(element).not.toBeNull();

  if (!element) {
    throw new Error(`Missing contrast target: ${label}`);
  }

  const ratio = getElementContrastRatio(element);

  expect(
    ratio,
    `${label} contrast ratio ${ratio.toFixed(2)} is below ${minimumTextContrastRatio}`,
  ).toBeGreaterThanOrEqual(minimumTextContrastRatio);
}

test('TinyrackMantineProvider renders Mantine components with theme variables', async () => {
  const screen = await render(
    <TinyrackMantineProvider>
      <Button>Save</Button>
      <TextInput label="Name" />
    </TinyrackMantineProvider>,
  );

  await expect.element(screen.getByText('Save')).toBeVisible();
  await expect.element(screen.getByLabelText('Name')).toBeVisible();
  expect(
    getComputedStyle(document.documentElement).getPropertyValue('--tinyrack-font-body'),
  ).toContain('Inter');
});

test('TinyrackMantineProvider supports scoped css variable selectors', async () => {
  const root = document.createElement('section');
  root.id = 'tinyrack-scope';
  document.body.append(root);

  const screen = await render(
    <TinyrackMantineProvider cssVariablesSelector="#tinyrack-scope">
      <Button>Scoped</Button>
    </TinyrackMantineProvider>,
    { container: root },
  );

  await expect.element(screen.getByText('Scoped')).toBeVisible();
  expect(
    Array.from(document.querySelectorAll('style')).some((style) =>
      style.textContent?.includes('#tinyrack-scope'),
    ),
  ).toBe(true);
});

test('uses dark color scheme by default for Tinyrack black-tone identity', async () => {
  const screen = await render(
    <TinyrackMantineProvider>
      <Card data-testid="card" withBorder>
        <Text>Dark Mantine card</Text>
      </Card>
    </TinyrackMantineProvider>,
  );

  await expect.element(screen.getByText('Dark Mantine card')).toBeVisible();
  const card = document.querySelector('[data-testid="card"]');
  expect(card).not.toBeNull();
  expect(getComputedStyle(card as Element).backgroundColor).not.toBe(
    'rgb(255, 255, 255)',
  );
});

test.each([
  'dark',
  'light',
] as const)('keeps primary Mantine filled states readable in %s mode', async (colorScheme) => {
  await render(
    <TinyrackMantineProvider forceColorScheme={colorScheme}>
      <Button>Primary button</Button>
      <Badge>Healthy</Badge>
      <Chip defaultChecked>Compact density</Chip>
      <Pagination total={4} value={1} />
      <ThemeIcon>TR</ThemeIcon>
      <Indicator label="2">
        <Button variant="default">Inbox</Button>
      </Indicator>
    </TinyrackMantineProvider>,
  );

  await waitForMantineColorScheme(colorScheme);
  expectReadableContrast('.mantine-Button-root', `${colorScheme} Button`);
  expectReadableContrast('.mantine-Badge-root', `${colorScheme} Badge`);
  expectReadableContrast(
    '.mantine-Chip-label[data-checked="true"]',
    `${colorScheme} Chip`,
  );
  expectReadableContrast(
    '.mantine-Pagination-control[data-active="true"]',
    `${colorScheme} Pagination`,
  );
  expectReadableContrast('.mantine-ThemeIcon-root', `${colorScheme} ThemeIcon`);
  expectReadableContrast('.mantine-Indicator-indicator', `${colorScheme} Indicator`);
});
