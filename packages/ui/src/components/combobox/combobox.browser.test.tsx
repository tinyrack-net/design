import '../../core/core.css';
import './combobox.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Combobox, ComboboxRoot } from './index.js';

function ServiceCombobox({
  onValueChange,
}: {
  onValueChange?: (value: unknown) => void;
}) {
  return (
    <form data-testid="service-form" style={{ marginInline: '2rem', width: '16rem' }}>
      <Combobox.Root
        items={['Alpha', 'Beta', 'Gamma']}
        name="service"
        onValueChange={onValueChange}
      >
        <label htmlFor="service-input">Service</label>
        <Combobox.InputGroup data-testid="service-input-group">
          <Combobox.Input id="service-input" ref={createRef<HTMLInputElement>()} />
          <Combobox.Clear aria-label="Clear service">Clear</Combobox.Clear>
          <Combobox.Trigger aria-label="Open services">Open</Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.Arrow />
              <Combobox.List>
                {(item: string) => (
                  <Combobox.Item key={item} value={item}>
                    {item}
                  </Combobox.Item>
                )}
              </Combobox.List>
              <Combobox.Empty>No matches</Combobox.Empty>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </form>
  );
}

test('assembles the Tinyrack combobox anatomy and accessible relationships', async () => {
  expect(Combobox.Root).toBe(ComboboxRoot);
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
    <Combobox.Root items={['Alpha']}>
      <Combobox.InputGroup data-testid="adorned-input-group">
        <Combobox.InputAdornment
          aria-hidden="true"
          className="custom-adornment"
          data-testid="input-adornment"
          ref={adornmentRef}
          style={{ color: 'rgb(255, 0, 0)' }}
        >
          Search
        </Combobox.InputAdornment>
        <Combobox.Input aria-label="Adorned service" />
      </Combobox.InputGroup>
    </Combobox.Root>,
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
