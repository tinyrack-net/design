import '../../core/core.css';
import '../drawer/drawer.css';
import './select.css';
import { act, type CSSProperties, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRDrawer } from '../drawer/index.js';
import { TRSelect, TRSelectRoot } from './index.js';

test('renders the Tinyrack TRSelect wrapper', async () => {
  expect(TRSelect.Root).toBe(TRSelectRoot);
  await render(
    <TRSelect.Root defaultValue="alpha">
      <TRSelect.Trigger aria-label="Choice">
        <TRSelect.Value />
      </TRSelect.Trigger>
      <TRSelect.Portal>
        <TRSelect.Positioner>
          <TRSelect.Popup>
            <TRSelect.List>
              <TRSelect.Item value="alpha">
                <TRSelect.ItemText>Alpha</TRSelect.ItemText>
              </TRSelect.Item>
            </TRSelect.List>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>,
  );
  expect(document.querySelector('.tr-select-trigger')).not.toBeNull();
});

test('supports compact ui size on the root and trigger', async () => {
  await render(
    <TRSelect.Root defaultValue="alpha">
      <TRSelect.Trigger aria-label="Compact choice" uiSize="sm">
        <TRSelect.Value />
      </TRSelect.Trigger>
    </TRSelect.Root>,
  );
  const trigger = document.querySelector<HTMLElement>('.tr-select-trigger');
  expect(trigger?.dataset['uiSize']).toBe('sm');
  expect(getComputedStyle(trigger as HTMLElement).minHeight).toBe('32px');
});

test('keeps SVG icons centered at the trailing edge of fixed-width triggers', async () => {
  const items = {
    long: 'Rack with a longer label',
    short: 'Rack A',
  } as const;

  await render(
    <div>
      {(['short', 'long'] as const).map((value) => (
        <TRSelect.Root defaultValue={value} items={items} key={value}>
          <TRSelect.Trigger aria-label={`${value} rack`} style={{ width: '16rem' }}>
            <TRSelect.Value />
            <TRSelect.Icon aria-hidden="true">
              <svg viewBox="0 0 16 16" />
            </TRSelect.Icon>
          </TRSelect.Trigger>
        </TRSelect.Root>
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
    <TRSelect.Root defaultValue="alpha">
      <TRSelect.Trigger aria-label="Rack">
        <TRSelect.Value />
      </TRSelect.Trigger>
      <TRSelect.Portal>
        <TRSelect.Positioner>
          <TRSelect.Popup>
            <TRSelect.List>
              <TRSelect.Item value="alpha">
                <TRSelect.ItemText>Alpha</TRSelect.ItemText>
                <TRSelect.ItemIndicator>✓</TRSelect.ItemIndicator>
              </TRSelect.Item>
              <TRSelect.Item value="beta">
                <TRSelect.ItemText>Beta</TRSelect.ItemText>
              </TRSelect.Item>
            </TRSelect.List>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>,
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

test('keeps a select popup above an open drawer', async () => {
  await render(
    <TRDrawer.Root defaultOpen swipeDirection="left">
      <TRDrawer.Portal>
        <TRDrawer.Viewport>
          <TRDrawer.Popup aria-label="Navigation drawer">
            <TRSelect.Root defaultValue="alpha">
              <TRSelect.Trigger aria-label="Drawer language">
                <TRSelect.Value />
              </TRSelect.Trigger>
              <TRSelect.Portal>
                <TRSelect.Positioner>
                  <TRSelect.Popup>
                    <TRSelect.List>
                      <TRSelect.Item value="alpha">
                        <TRSelect.ItemText>English</TRSelect.ItemText>
                      </TRSelect.Item>
                      <TRSelect.Item value="beta">
                        <TRSelect.ItemText>한국어</TRSelect.ItemText>
                      </TRSelect.Item>
                    </TRSelect.List>
                  </TRSelect.Popup>
                </TRSelect.Positioner>
              </TRSelect.Portal>
            </TRSelect.Root>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>,
  );

  await page.getByRole('combobox', { name: 'Drawer language' }).click();

  const popup = document.querySelector<HTMLElement>('.tr-select-popup[data-open]');
  const option = document.querySelector<HTMLElement>('.tr-select-item');
  expect(popup).not.toBeNull();
  expect(option).not.toBeNull();
  const optionRect = (option as HTMLElement).getBoundingClientRect();
  expect(
    (
      document.elementFromPoint(
        optionRect.left + optionRect.width / 2,
        optionRect.top + optionRect.height / 2,
      ) as HTMLElement | null
    )?.closest('.tr-select-popup'),
  ).toBe(popup);
});

test('preserves explicit positioning props and class names', async () => {
  await render(
    <TRSelect.Root defaultValue="alpha">
      <TRSelect.Trigger aria-label="Aligned choice">
        <TRSelect.Value />
      </TRSelect.Trigger>
      <TRSelect.Portal>
        <TRSelect.Positioner
          alignItemWithTrigger
          className="consumer-positioner"
          sideOffset={0}
        >
          <TRSelect.Popup>
            <TRSelect.List>
              <TRSelect.Item value="alpha">
                <TRSelect.ItemText>Alpha</TRSelect.ItemText>
              </TRSelect.Item>
              <TRSelect.Item value="beta">
                <TRSelect.ItemText>Beta</TRSelect.ItemText>
              </TRSelect.Item>
            </TRSelect.List>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>,
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
      <TRSelect.Root
        items={{ alpha: 'Rack Alpha', beta: 'Rack Beta', gamma: 'Rack Gamma' }}
        name="rack"
        onOpenChange={setOpen}
        onValueChange={(nextValue) => setValue(nextValue as string | null)}
        open={open}
        required
        value={value}
      >
        <TRSelect.Label>Deployment rack</TRSelect.Label>
        <TRSelect.Trigger aria-label="Deployment rack">
          <TRSelect.Value placeholder="Choose a rack" />
        </TRSelect.Trigger>
        <TRSelect.Portal>
          <TRSelect.Positioner>
            <TRSelect.Popup>
              <TRSelect.List>
                <TRSelect.Item value="alpha">
                  <TRSelect.ItemText>Rack Alpha</TRSelect.ItemText>
                </TRSelect.Item>
                <TRSelect.Item value="beta">
                  <TRSelect.ItemText>Rack Beta</TRSelect.ItemText>
                </TRSelect.Item>
                <TRSelect.Item disabled value="gamma">
                  <TRSelect.ItemText>Rack Gamma</TRSelect.ItemText>
                </TRSelect.Item>
              </TRSelect.List>
            </TRSelect.Popup>
          </TRSelect.Positioner>
        </TRSelect.Portal>
      </TRSelect.Root>
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
      <TRSelect.Root defaultValue="alpha" readOnly>
        <TRSelect.Trigger aria-label="Read only rack">
          <TRSelect.Value />
        </TRSelect.Trigger>
      </TRSelect.Root>
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
      <TRSelect.Root defaultOpen defaultValue="alpha" modal>
        <TRSelect.Trigger aria-label="Editable rack">
          <TRSelect.Value />
        </TRSelect.Trigger>
        <TRSelect.Portal>
          <TRSelect.Backdrop />
          <TRSelect.Positioner>
            <TRSelect.Popup>
              <TRSelect.List>
                <TRSelect.Item value="alpha">
                  <TRSelect.ItemText>Alpha</TRSelect.ItemText>
                </TRSelect.Item>
                <TRSelect.Item value="beta">
                  <TRSelect.ItemText>Beta</TRSelect.ItemText>
                </TRSelect.Item>
              </TRSelect.List>
            </TRSelect.Popup>
          </TRSelect.Positioner>
        </TRSelect.Portal>
      </TRSelect.Root>
      <TRSelect.Root defaultValue="alpha" readOnly>
        <TRSelect.Trigger aria-label="Read only styled rack">
          <TRSelect.Value />
        </TRSelect.Trigger>
      </TRSelect.Root>
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

test('exports Select-specific separator anatomy with standalone styling', async () => {
  await render(
    <TRSelect.Root defaultOpen defaultValue="alpha">
      <TRSelect.Trigger aria-label="Separated rack">
        <TRSelect.Value />
      </TRSelect.Trigger>
      <TRSelect.Portal>
        <TRSelect.Positioner>
          <TRSelect.Popup>
            <TRSelect.List>
              <TRSelect.Item value="alpha">
                <TRSelect.ItemText>Alpha</TRSelect.ItemText>
              </TRSelect.Item>
              <TRSelect.Separator />
              <TRSelect.Item value="beta">
                <TRSelect.ItemText>Beta</TRSelect.ItemText>
              </TRSelect.Item>
            </TRSelect.List>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>,
  );

  const separator = document.querySelector<HTMLElement>('.tr-select-separator');
  expect(separator).not.toBeNull();
  expect(separator?.getAttribute('role')).toBe('separator');
  expect(separator?.dataset['orientation']).toBe('horizontal');
  expect(getComputedStyle(separator as HTMLElement).height).not.toBe('0px');
});

test('sizes overflow scroll controls and keeps the collection within available space', async () => {
  const items = Array.from({ length: 20 }, (_, index) => ({
    label: `Rack ${index + 1}`,
    value: `rack-${index + 1}`,
  }));
  await render(
    <TRSelect.Root defaultOpen defaultValue="rack-1">
      <TRSelect.Trigger aria-label="Scrollable rack">
        <TRSelect.Value />
      </TRSelect.Trigger>
      <TRSelect.Portal>
        <TRSelect.Positioner>
          <TRSelect.Popup style={{ maxHeight: 120 }}>
            <TRSelect.ScrollUpArrow keepMounted>Up</TRSelect.ScrollUpArrow>
            <TRSelect.List>
              {items.map((item) => (
                <TRSelect.Item key={item.value} value={item.value}>
                  <TRSelect.ItemText>{item.label}</TRSelect.ItemText>
                </TRSelect.Item>
              ))}
            </TRSelect.List>
            <TRSelect.ScrollDownArrow keepMounted>Down</TRSelect.ScrollDownArrow>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>,
  );

  const down = document.querySelector<HTMLElement>('.tr-select-scroll-down-arrow');
  expect(down).not.toBeNull();
  expect(Number.parseFloat(getComputedStyle(down as HTMLElement).minHeight)).toBe(40);
  expect(
    document.querySelector<HTMLElement>('.tr-select-popup')?.scrollHeight,
  ).toBeGreaterThan(120);
});

test('supports uncontrolled keyboard typeahead, selection, dismissal, and focus return', async () => {
  await render(
    <div>
      <button type="button">Outside</button>
      <TRSelect.Root defaultValue="alpha" items={{ alpha: 'Alpha', beta: 'Beta' }}>
        <TRSelect.Trigger aria-label="Keyboard rack">
          <TRSelect.Value />
        </TRSelect.Trigger>
        <TRSelect.Portal>
          <TRSelect.Positioner>
            <TRSelect.Popup>
              <TRSelect.List>
                <TRSelect.Item value="alpha">
                  <TRSelect.ItemText>Alpha</TRSelect.ItemText>
                </TRSelect.Item>
                <TRSelect.Item value="beta">
                  <TRSelect.ItemText>Beta</TRSelect.ItemText>
                </TRSelect.Item>
              </TRSelect.List>
            </TRSelect.Popup>
          </TRSelect.Positioner>
        </TRSelect.Portal>
      </TRSelect.Root>
    </div>,
  );

  const trigger = page.getByRole('combobox', { name: 'Keyboard rack' });
  trigger.element().focus();
  await userEvent.keyboard('{ArrowDown}');
  await expect
    .poll(() => document.querySelectorAll('.tr-select-popup[data-open]').length)
    .toBe(1);
  await userEvent.keyboard('b');
  await expect
    .poll(
      () => document.querySelector('.tr-select-item[data-highlighted]')?.textContent,
    )
    .toContain('Beta');
  await userEvent.keyboard('{Enter}');
  await expect.poll(() => trigger.element().textContent).toContain('Beta');
  await expect.poll(() => document.activeElement).toBe(trigger.element());

  await trigger.click();
  await page.getByRole('button', { name: 'Outside' }).click({ force: true });
  await expect
    .poll(() => document.querySelectorAll('.tr-select-popup[data-open]').length)
    .toBe(0);
});

test('integrates disabled, required, external form ownership, and native reset behavior', async () => {
  const formInputRef = createRef<HTMLInputElement>();
  let disabledInput: HTMLInputElement | null = null;
  await render(
    <div>
      <form id="rack-form" />
      <TRSelect.Root
        defaultValue="alpha"
        form="rack-form"
        inputRef={formInputRef}
        items={{ alpha: 'Alpha', beta: 'Beta' }}
        name="rack"
        required
      >
        <TRSelect.Trigger aria-label="Form rack">
          <TRSelect.Value />
        </TRSelect.Trigger>
        <TRSelect.Portal>
          <TRSelect.Positioner>
            <TRSelect.Popup>
              <TRSelect.List>
                <TRSelect.Item value="alpha">
                  <TRSelect.ItemText>Alpha</TRSelect.ItemText>
                </TRSelect.Item>
                <TRSelect.Item value="beta">
                  <TRSelect.ItemText>Beta</TRSelect.ItemText>
                </TRSelect.Item>
              </TRSelect.List>
            </TRSelect.Popup>
          </TRSelect.Positioner>
        </TRSelect.Portal>
      </TRSelect.Root>
      <TRSelect.Root
        disabled
        inputRef={(input) => {
          disabledInput = input;
        }}
        name="disabled-rack"
      >
        <TRSelect.Trigger aria-label="Disabled rack">
          <TRSelect.Value placeholder="Choose" />
        </TRSelect.Trigger>
      </TRSelect.Root>
    </div>,
  );

  const trigger = page.getByRole('combobox', { name: 'Form rack' });
  await trigger.click();
  await page.getByRole('option', { name: 'Beta' }).click();
  const form = document.querySelector<HTMLFormElement>('#rack-form');
  expect(formInputRef.current?.form).toBe(form);
  expect(disabledInput).not.toBeNull();
  expect(new FormData(form as HTMLFormElement).get('rack')).toBe('beta');
  expect((form as HTMLFormElement).checkValidity()).toBe(true);

  (form as HTMLFormElement).reset();
  await expect.poll(() => trigger.element().textContent).toContain('Alpha');
  expect(new FormData(form as HTMLFormElement).get('rack')).toBe('alpha');
  expect(
    page.getByRole('combobox', { name: 'Disabled rack' }).element(),
  ).toBeDisabled();
});

test('preserves consumer classes, refs, and Select token overrides', async () => {
  const triggerRef = createRef<HTMLButtonElement>();
  await render(
    <TRSelect.Root defaultValue="alpha">
      <TRSelect.Trigger
        aria-label="Custom rack"
        className="consumer-trigger"
        ref={triggerRef}
        style={
          {
            '--tr-select-control-background': 'rgb(1, 2, 3)',
          } as CSSProperties
        }
      >
        <TRSelect.Value />
      </TRSelect.Trigger>
    </TRSelect.Root>,
  );

  expect(triggerRef.current).not.toBeNull();
  expect(triggerRef.current?.classList.contains('consumer-trigger')).toBe(true);
  expect(
    getComputedStyle(triggerRef.current as HTMLButtonElement).backgroundColor,
  ).toBe('rgb(1, 2, 3)');
});

test('renders and hydrates the Select contract without recovery', async () => {
  const fixture = (
    <TRSelect.Root defaultValue="alpha" items={{ alpha: 'Alpha' }}>
      <TRSelect.Label>Hydrated rack</TRSelect.Label>
      <TRSelect.Trigger aria-label="Hydrated rack">
        <TRSelect.Value />
      </TRSelect.Trigger>
    </TRSelect.Root>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('[aria-label="Hydrated rack"]')).not.toBeNull();
  await act(async () => root.unmount());
  host.remove();
});
