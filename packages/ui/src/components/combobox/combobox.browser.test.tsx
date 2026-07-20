import '../../core/core.css';
import './combobox.css';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRCombobox, TRComboboxRoot } from './index.js';

function ServiceCombobox({
  onValueChange,
}: {
  onValueChange?: (value: unknown) => void;
}) {
  return (
    <form data-testid="service-form" style={{ marginInline: '2rem', width: '16rem' }}>
      <TRCombobox.Root
        items={['Alpha', 'Beta', 'Gamma']}
        name="service"
        onValueChange={onValueChange}
      >
        <label htmlFor="service-input">Service</label>
        <TRCombobox.InputGroup data-testid="service-input-group">
          <TRCombobox.Input id="service-input" ref={createRef<HTMLInputElement>()} />
          <TRCombobox.Clear aria-label="Clear service">Clear</TRCombobox.Clear>
          <TRCombobox.Trigger aria-label="Open services">Open</TRCombobox.Trigger>
        </TRCombobox.InputGroup>
        <TRCombobox.Portal>
          <TRCombobox.Positioner>
            <TRCombobox.Popup>
              <TRCombobox.Arrow />
              <TRCombobox.List>
                {(item: string) => (
                  <TRCombobox.Item key={item} value={item}>
                    {item}
                  </TRCombobox.Item>
                )}
              </TRCombobox.List>
              <TRCombobox.Empty>No matches</TRCombobox.Empty>
            </TRCombobox.Popup>
          </TRCombobox.Positioner>
        </TRCombobox.Portal>
      </TRCombobox.Root>
    </form>
  );
}

test('assembles the Tinyrack combobox anatomy and accessible relationships', async () => {
  expect(TRCombobox.Root).toBe(TRComboboxRoot);
  await render(<ServiceCombobox />);

  const input = page.getByRole('combobox', { name: 'Service' }).element();
  const trigger = page.getByRole('button', { name: 'Open services' }).element();
  expect(input).toHaveClass('tr-combobox', 'tr-input');
  expect(input.getAttribute('aria-expanded')).toBe('false');
  expect(trigger).toHaveClass('tr-combobox-trigger');
  expect(page.getByTestId('service-input-group').element()).toHaveClass(
    'tr-input-group',
    'tr-combobox-input-group',
  );
  expect(input.getAttribute('aria-haspopup')).toBe('listbox');
});

test('centers an input adornment and preserves native span props', async () => {
  const adornmentRef = createRef<HTMLSpanElement>();
  await render(
    <TRCombobox.Root items={['Alpha']}>
      <TRCombobox.InputGroup data-testid="adorned-input-group">
        <TRCombobox.InputAdornment
          aria-hidden="true"
          className="custom-adornment"
          data-testid="input-adornment"
          ref={adornmentRef}
          style={{ color: 'rgb(255, 0, 0)' }}
        >
          Search
        </TRCombobox.InputAdornment>
        <TRCombobox.Input aria-label="Adorned service" />
      </TRCombobox.InputGroup>
    </TRCombobox.Root>,
  );

  const group = page.getByTestId('adorned-input-group').element();
  const adornment = page.getByTestId('input-adornment').element();
  expect(adornmentRef.current).toBe(adornment);
  expect(adornment).toHaveClass(
    'tr-input-group-adornment',
    'tr-combobox-input-adornment',
    'custom-adornment',
  );
  expect(adornment).toHaveAttribute('data-side', 'start');
  expect(getComputedStyle(adornment).color).toBe('rgb(255, 0, 0)');

  const groupRect = group.getBoundingClientRect();
  const adornmentRect = adornment.getBoundingClientRect();
  expect(
    Math.abs(
      adornmentRect.top +
        adornmentRect.height / 2 -
        (groupRect.top + groupRect.height / 2),
    ),
  ).toBeLessThanOrEqual(1);
});

test('selects by pointer, syncs form value, closes, and restores input focus', async () => {
  const onValueChange = vi.fn();
  await render(<ServiceCombobox onValueChange={onValueChange} />);
  const input = page
    .getByRole('combobox', { name: 'Service' })
    .element() as HTMLInputElement;
  const trigger = page.getByRole('button', { name: 'Open services' }).element();

  await userEvent.click(trigger);
  await expect.poll(() => input.getAttribute('aria-expanded')).toBe('true');
  const beta = page.getByRole('option', { name: 'Beta' }).element();
  await userEvent.click(beta);

  await expect.poll(() => input.value).toBe('Beta');
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('Beta');
  const form = page.getByTestId('service-form').element() as HTMLFormElement;
  expect(new FormData(form).get('service')).toBe('Beta');
  await expect.poll(() => input.getAttribute('aria-expanded')).toBe('false');
  await expect.poll(() => document.activeElement).toBe(input);
});

test('filters and selects a result from the keyboard', async () => {
  await render(<ServiceCombobox />);
  const input = page
    .getByRole('combobox', { name: 'Service' })
    .element() as HTMLInputElement;

  input.focus();
  await userEvent.keyboard('Ga');
  await expect.poll(() => input.value).toBe('Ga');
  await expect.poll(() => input.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{ArrowDown}{Enter}');
  await expect.poll(() => input.value).toBe('Gamma');
  expect(new FormData(input.form as HTMLFormElement).get('service')).toBe('Gamma');
});

test('gives the highlighted option a visible focus indicator', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(<ServiceCombobox />);
  const input = page
    .getByRole('combobox', { name: 'Service' })
    .element() as HTMLInputElement;
  input.focus();
  await userEvent.keyboard('{ArrowDown}');
  const highlighted = document.querySelector<HTMLElement>(
    '.tr-combobox-option[data-highlighted]',
  );
  expect(highlighted).not.toBeNull();
  expect(getComputedStyle(highlighted as HTMLElement).outlineStyle).toBe('solid');
});

test('keeps the portal inside the viewport and dismisses with Escape', async () => {
  await render(<ServiceCombobox />);
  const input = page
    .getByRole('combobox', { name: 'Service' })
    .element() as HTMLInputElement;
  await userEvent.click(page.getByRole('button', { name: 'Open services' }).element());
  await expect.poll(() => input.getAttribute('aria-expanded')).toBe('true');

  const popup = document.querySelector<HTMLElement>('.tr-combobox-content');
  const popupRect = popup?.getBoundingClientRect();
  const groupRect = page
    .getByTestId('service-input-group')
    .element()
    .getBoundingClientRect();
  const triggerRect = document
    .querySelector<HTMLElement>('.tr-combobox-trigger')
    ?.getBoundingClientRect();
  const arrowRect = document
    .querySelector<HTMLElement>('.tr-combobox-arrow')
    ?.getBoundingClientRect();
  expect(popupRect?.left).toBeGreaterThanOrEqual(0);
  expect(popupRect?.right).toBeLessThanOrEqual(window.innerWidth);
  expect(Math.abs((popupRect?.width ?? 0) - groupRect.width)).toBeLessThanOrEqual(1);
  expect(Math.abs((popupRect?.left ?? 0) - groupRect.left)).toBeLessThanOrEqual(1);
  expect(
    Math.abs((triggerRect?.width ?? 0) - (triggerRect?.height ?? 0)),
  ).toBeLessThanOrEqual(1);
  expect(arrowRect?.width).toBeGreaterThan(0);
  expect(arrowRect?.height).toBeGreaterThan(0);
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => input.getAttribute('aria-expanded')).toBe('false');
});

test('renders and updates the complete multiple chip and grid anatomy', async () => {
  function MultipleCombobox() {
    const items = ['Alpha', 'Beta'];
    const [value, setValue] = useState<string[]>(['Alpha']);
    return (
      <TRCombobox.Root
        grid
        items={items}
        multiple
        onValueChange={setValue}
        value={value}
      >
        <label htmlFor="multiple-services-input">Services</label>
        <TRCombobox.InputGroup>
          <TRCombobox.Chips>
            <TRCombobox.Value>
              {(selected: string[]) =>
                selected.map((item) => (
                  <TRCombobox.Chip key={item}>
                    {item}
                    <TRCombobox.ChipRemove aria-label={`Remove ${item}`}>
                      ×
                    </TRCombobox.ChipRemove>
                  </TRCombobox.Chip>
                ))
              }
            </TRCombobox.Value>
            <TRCombobox.Input id="multiple-services-input" />
          </TRCombobox.Chips>
          <TRCombobox.Trigger aria-label="Show services">Open</TRCombobox.Trigger>
        </TRCombobox.InputGroup>
        <TRCombobox.Portal>
          <TRCombobox.Positioner>
            <TRCombobox.Popup>
              <TRCombobox.List>
                <TRCombobox.Collection>
                  {(item: string) => (
                    <TRCombobox.Row key={item}>
                      <TRCombobox.Item value={item}>{item}</TRCombobox.Item>
                    </TRCombobox.Row>
                  )}
                </TRCombobox.Collection>
              </TRCombobox.List>
            </TRCombobox.Popup>
          </TRCombobox.Positioner>
        </TRCombobox.Portal>
      </TRCombobox.Root>
    );
  }

  await render(<MultipleCombobox />);
  expect(
    document.querySelector('label[for="multiple-services-input"]')?.textContent,
  ).toBe('Services');
  expect(document.querySelectorAll('.tr-combobox-chip')).toHaveLength(1);
  expect(
    getComputedStyle(document.querySelector('.tr-combobox-chips') as Element).display,
  ).toBe('flex');
  const multipleGroup = document.querySelector<HTMLElement>('.tr-combobox-input-group');
  const multipleTrigger = document.querySelector<HTMLElement>('.tr-combobox-trigger');
  expect(getComputedStyle(multipleTrigger as HTMLElement).borderInlineStartWidth).toBe(
    '0px',
  );
  expect(multipleTrigger?.getBoundingClientRect().width).toBe(32);
  expect(multipleTrigger?.getBoundingClientRect().height).toBeLessThanOrEqual(
    multipleGroup?.getBoundingClientRect().height ?? 0,
  );
  await userEvent.click(page.getByRole('button', { name: 'Remove Alpha' }).element());
  await expect
    .poll(() => document.querySelectorAll('.tr-combobox-chip').length)
    .toBe(0);
  await userEvent.click(page.getByRole('button', { name: 'Services' }).element());
  await expect.poll(() => document.querySelectorAll('.tr-combobox-row').length).toBe(2);
});

test('uses TRCombobox.Label for a trigger-only select anatomy', async () => {
  await render(
    <TRCombobox.Root items={['Alpha', 'Beta']}>
      <TRCombobox.Label>Services</TRCombobox.Label>
      <TRCombobox.Trigger>Choose a service</TRCombobox.Trigger>
      <TRCombobox.Portal>
        <TRCombobox.Positioner>
          <TRCombobox.Popup>
            <TRCombobox.List>
              <TRCombobox.Item value="Alpha">Alpha</TRCombobox.Item>
              <TRCombobox.Item value="Beta">Beta</TRCombobox.Item>
            </TRCombobox.List>
          </TRCombobox.Popup>
        </TRCombobox.Positioner>
      </TRCombobox.Portal>
    </TRCombobox.Root>,
  );
  expect(document.querySelector('.tr-combobox-label')?.textContent).toBe('Services');
  expect(page.getByRole('combobox', { name: 'Services' }).element()).toHaveClass(
    'tr-combobox-trigger',
  );
});
