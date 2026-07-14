import './autocomplete.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Autocomplete, AutocompleteRoot } from './index.js';

test('renders the Tinyrack Autocomplete wrapper', async () => {
  expect(Autocomplete.Root).toBe(AutocompleteRoot);
  await render(
    <Autocomplete.Root items={['Alpha', 'Beta']}>
      <Autocomplete.Input aria-label="Search" />
    </Autocomplete.Root>,
  );
  expect(document.querySelector('.tr-autocomplete-input')).not.toBeNull();
});

test('filters, selects with the keyboard, and submits the native value', async () => {
  const onValueChange = vi.fn();
  await render(
    <form>
      <Autocomplete.Root
        items={['Rack Alpha', 'Rack Beta', 'Staging rack']}
        name="rack"
        onValueChange={onValueChange}
      >
        <Autocomplete.Input aria-label="Rack" />
        <Autocomplete.Clear aria-label="Clear rack" />
        <Autocomplete.Portal>
          <Autocomplete.Positioner>
            <Autocomplete.Popup>
              <Autocomplete.List>
                <Autocomplete.Item value="Rack Alpha">Rack Alpha</Autocomplete.Item>
                <Autocomplete.Item value="Rack Beta">Rack Beta</Autocomplete.Item>
                <Autocomplete.Item value="Staging rack">Staging rack</Autocomplete.Item>
                <Autocomplete.Empty>No matching racks</Autocomplete.Empty>
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </form>,
  );

  const input = document.querySelector<HTMLInputElement>('.tr-autocomplete-input');
  input?.focus();
  await userEvent.keyboard('Beta');
  await expect
    .poll(() =>
      document.querySelector('.tr-autocomplete-popup')?.hasAttribute('data-open'),
    )
    .toBe(true);
  expect(document.body.textContent).toContain('Rack Beta');

  const beta = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-autocomplete-item'),
  ).find((item) => item.textContent === 'Rack Beta');
  await userEvent.click(beta as HTMLElement);
  await expect.poll(() => input?.value).toBe('Rack Beta');
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('Rack Beta');
  expect(
    new FormData(document.querySelector('form') as HTMLFormElement).get('rack'),
  ).toBe('Rack Beta');

  document.querySelector<HTMLButtonElement>('.tr-autocomplete-clear')?.click();
  await expect.poll(() => input?.value).toBe('');
});
