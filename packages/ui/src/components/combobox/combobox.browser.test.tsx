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
    <form data-testid="service-form">
      <Combobox.Root
        items={['Alpha', 'Beta', 'Gamma']}
        name="service"
        onValueChange={onValueChange}
      >
        <label htmlFor="service-input">Service</label>
        <Combobox.Input id="service-input" ref={createRef<HTMLInputElement>()} />
        <Combobox.Trigger aria-label="Open services">Open</Combobox.Trigger>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
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
  expect(input.getAttribute('aria-haspopup')).toBe('listbox');
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
  const rect = popup?.getBoundingClientRect();
  expect(rect?.left).toBeGreaterThanOrEqual(0);
  expect(rect?.right).toBeLessThanOrEqual(window.innerWidth);
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => input.getAttribute('aria-expanded')).toBe('false');
});
