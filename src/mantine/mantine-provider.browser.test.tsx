import '@mantine/core/styles.css';
import './styles.css';
import { Button, Card, Text, TextInput } from '@mantine/core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TinyrackMantineProvider } from './index.js';

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
