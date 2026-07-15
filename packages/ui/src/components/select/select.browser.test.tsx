import '../../core/core.css';
import './select.css';
import { useState } from 'react';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
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

test('keeps SVG icons centered at the trailing edge of fixed-width triggers', async () => {
  const items = {
    long: 'Rack with a longer label',
    short: 'Rack A',
  } as const;

  await render(
    <div>
      {(['short', 'long'] as const).map((value) => (
        <Select.Root defaultValue={value} items={items} key={value}>
          <Select.Trigger aria-label={`${value} rack`} style={{ width: '16rem' }}>
            <Select.Value />
            <Select.Icon aria-hidden="true">
              <svg viewBox="0 0 16 16" />
            </Select.Icon>
          </Select.Trigger>
        </Select.Root>
      ))}
    </div>,
  );

  const triggers = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-select-trigger'),
  );
  const trailingInsets = triggers.map((trigger) => {
    const icon = trigger.querySelector<HTMLElement>('.tr-select-icon');
    const svg = icon?.querySelector<SVGElement>('svg');
    const triggerRect = trigger.getBoundingClientRect();
    const iconRect = icon?.getBoundingClientRect();
    const svgRect = svg?.getBoundingClientRect();
    const triggerStyle = getComputedStyle(trigger);
    const iconStyle = getComputedStyle(icon as HTMLElement);

    expect(icon).not.toBeNull();
    expect(svg).not.toBeNull();
    expect(iconStyle.alignItems).toBe('center');
    expect(iconStyle.flexShrink).toBe('0');
    expect(iconStyle.justifyContent).toBe('center');
    expect(Number.parseFloat(iconStyle.marginInlineStart)).toBeGreaterThan(0);
    expect(svgRect?.width).toBe(16);
    expect(svgRect?.height).toBe(16);
    expect(
      Math.abs(
        (iconRect?.top ?? 0) +
          (iconRect?.height ?? 0) / 2 -
          (triggerRect.top + triggerRect.height / 2),
      ),
    ).toBeLessThan(0.5);

    const trailingInset = triggerRect.right - (iconRect?.right ?? 0);
    expect(
      Math.abs(trailingInset - Number.parseFloat(triggerStyle.paddingInlineEnd)),
    ).toBeLessThan(0.5);
    return trailingInset;
  });

  expect(triggers).toHaveLength(2);
  expect(Math.abs((trailingInsets[0] ?? 0) - (trailingInsets[1] ?? 0))).toBeLessThan(
    0.5,
  );
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
  expect(selectedItemStyle.outlineStyle).toBe('solid');
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

function ControlledRackSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  return (
    <form data-testid="select-form">
      <Select.Root
        items={{ alpha: 'Rack Alpha', beta: 'Rack Beta', gamma: 'Rack Gamma' }}
        name="rack"
        onOpenChange={setOpen}
        onValueChange={(nextValue) => setValue(nextValue as string | null)}
        open={open}
        required
        value={value}
      >
        <Select.Label>Deployment rack</Select.Label>
        <Select.Trigger aria-label="Deployment rack">
          <Select.Value placeholder="Choose a rack" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.List>
                <Select.Item value="alpha">
                  <Select.ItemText>Rack Alpha</Select.ItemText>
                </Select.Item>
                <Select.Item value="beta">
                  <Select.ItemText>Rack Beta</Select.ItemText>
                </Select.Item>
                <Select.Item disabled value="gamma">
                  <Select.ItemText>Rack Gamma</Select.ItemText>
                </Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      <output data-testid="select-state">{`${open ? 'open' : 'closed'}:${value ?? ''}`}</output>
    </form>
  );
}

test('synchronizes controlled open/value state and native form data', async () => {
  await render(<ControlledRackSelect />);

  const trigger = page.getByRole('combobox', { name: 'Deployment rack' });
  trigger.element().focus();
  await userEvent.keyboard('{ArrowDown}');
  await expect
    .poll(() => document.querySelector('[data-testid="select-state"]')?.textContent)
    .toBe('open:');

  await page.getByRole('option', { name: 'Rack Beta' }).click();
  await expect
    .poll(() => document.querySelector('[data-testid="select-state"]')?.textContent)
    .toBe('closed:beta');
  expect(trigger.element().textContent).toContain('Rack Beta');

  const form = document.querySelector<HTMLFormElement>('[data-testid="select-form"]');
  expect(new FormData(form as HTMLFormElement).get('rack')).toBe('beta');
  await expect.poll(() => document.activeElement).toBe(trigger.element());
});

test('prevents disabled items and read-only roots from changing', async () => {
  await render(
    <div>
      <ControlledRackSelect />
      <Select.Root defaultValue="alpha" readOnly>
        <Select.Trigger aria-label="Read only rack">
          <Select.Value />
        </Select.Trigger>
      </Select.Root>
    </div>,
  );

  const trigger = page.getByRole('combobox', { name: 'Deployment rack' });
  await trigger.click();
  await expect
    .poll(() => document.querySelector('[data-testid="select-state"]')?.textContent)
    .toBe('open:');
  const disabledOption = page.getByRole('option', { name: 'Rack Gamma' });
  expect(disabledOption.element().getAttribute('aria-disabled')).toBe('true');
  await disabledOption.click({ force: true });
  expect(document.querySelector('[data-testid="select-state"]')?.textContent).toBe(
    'open:',
  );

  await userEvent.keyboard('{Escape}');
  const readOnlyTrigger = page.getByRole('combobox', { name: 'Read only rack' });
  await readOnlyTrigger.click();
  expect(document.querySelectorAll('.tr-select-popup[data-open]')).toHaveLength(0);
  expect(readOnlyTrigger.element().textContent).toContain('alpha');
});

test('28-30 keeps modal popup interactive and distinguishes read-only styling', async () => {
  await render(
    <div>
      <Select.Root defaultOpen defaultValue="alpha" modal>
        <Select.Trigger aria-label="Editable rack">
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Backdrop />
          <Select.Positioner>
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
      </Select.Root>
      <Select.Root defaultValue="alpha" readOnly>
        <Select.Trigger aria-label="Read only styled rack">
          <Select.Value />
        </Select.Trigger>
      </Select.Root>
    </div>,
  );
  const popup = document.querySelector<HTMLElement>('.tr-select-popup');
  const option = document.querySelector<HTMLElement>('.tr-select-item');
  const editable = document.querySelector<HTMLElement>('[aria-label="Editable rack"]');
  const readOnly = document.querySelector<HTMLElement>(
    '[aria-label="Read only styled rack"]',
  );
  const optionRect = (option as HTMLElement).getBoundingClientRect();
  expect(
    (
      document.elementFromPoint(
        optionRect.left + optionRect.width / 2,
        optionRect.top + optionRect.height / 2,
      ) as HTMLElement | null
    )?.closest('.tr-select-popup'),
  ).toBe(popup);
  expect(getComputedStyle(popup as HTMLElement).paddingTop).toBe('8px');
  expect(getComputedStyle(readOnly as HTMLElement).backgroundColor).not.toBe(
    getComputedStyle(editable as HTMLElement).backgroundColor,
  );
  expect(getComputedStyle(readOnly as HTMLElement).cursor).toBe('default');
});
