import '../../core/core.css';
import './select.css';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Select, SelectRoot } from './index.js';

test('renders the Tinyrack Select wrapper', async () => {
  expect(Select.Root).toBe(SelectRoot);
  await render(
    <Select.Root defaultValue="alpha">
      <Select.Trigger aria-label="Choice">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              <Select.Item value="alpha">
                <Select.ItemText>Alpha</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>,
  );
  expect(document.querySelector('.tr-select-trigger')).not.toBeNull();
});

test('renders the portalled popup as a trigger-aligned Tinyrack layer', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <Select.Root defaultValue="alpha">
      <Select.Trigger aria-label="Rack">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              <Select.Item value="alpha">
                <Select.ItemText>Alpha</Select.ItemText>
                <Select.ItemIndicator>✓</Select.ItemIndicator>
              </Select.Item>
              <Select.Item value="beta">
                <Select.ItemText>Beta</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>,
  );

  await page.getByRole('combobox', { name: 'Rack' }).click();

  const trigger = document.querySelector<HTMLElement>('.tr-select-trigger');
  const positioner = document.querySelector<HTMLElement>('.tr-select-positioner');
  const popup = document.querySelector<HTMLElement>('.tr-select-popup');
  const selectedItem = document.querySelector<HTMLElement>(
    '.tr-select-item[data-selected]',
  );
  const indicator = document.querySelector<HTMLElement>('.tr-select-item-indicator');

  expect(trigger).not.toBeNull();
  expect(positioner).not.toBeNull();
  expect(popup?.classList.contains('tr-layer')).toBe(true);
  expect(selectedItem).not.toBeNull();
  expect(indicator).not.toBeNull();

  await expect.poll(() => positioner?.dataset['side']).toBe('bottom');
  await expect
    .poll(() => popup?.getBoundingClientRect().top)
    .toBeGreaterThan(trigger?.getBoundingClientRect().bottom ?? 0);

  const triggerWidth = trigger?.getBoundingClientRect().width ?? 0;
  expect(popup?.getBoundingClientRect().width ?? 0).toBeGreaterThanOrEqual(
    triggerWidth,
  );
  expect(getComputedStyle(popup as HTMLElement).fontSize).toBe(
    getComputedStyle(trigger as HTMLElement).fontSize,
  );

  const indicatorStyle = getComputedStyle(indicator as HTMLElement);
  expect(indicatorStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(indicatorStyle.color).not.toBe(indicatorStyle.backgroundColor);

  const selectedItemStyle = getComputedStyle(selectedItem as HTMLElement);
  expect(selectedItem?.hasAttribute('data-highlighted')).toBe(true);
  expect(selectedItemStyle.backgroundColor).not.toBe(
    getComputedStyle(popup as HTMLElement).backgroundColor,
  );
  expect(selectedItemStyle.outlineStyle).toBe('none');
});

test('preserves explicit positioning props and class names', async () => {
  await render(
    <Select.Root defaultValue="alpha">
      <Select.Trigger aria-label="Aligned choice">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner
          alignItemWithTrigger
          className="consumer-positioner"
          sideOffset={0}
        >
          <Select.Popup>
            <Select.List>
              <Select.Item value="alpha">
                <Select.ItemText>Alpha</Select.ItemText>
              </Select.Item>
              <Select.Item value="beta">
                <Select.ItemText>Beta</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>,
  );

  await page.getByRole('combobox', { name: 'Aligned choice' }).click();

  const trigger = document.querySelector<HTMLElement>('.tr-select-trigger');
  const positioner = document.querySelector<HTMLElement>('.tr-select-positioner');
  const popup = document.querySelector<HTMLElement>('.tr-select-popup');
  expect(positioner?.classList.contains('consumer-positioner')).toBe(true);
  await expect
    .poll(
      () =>
        (popup?.getBoundingClientRect().top ?? 0) -
        (trigger?.getBoundingClientRect().bottom ?? 0),
    )
    .toBe(0);
});
