import '../../core/core.css';
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
    <form style={{ marginInline: '2rem', width: '16rem' }}>
      <Autocomplete.Root
        items={['Rack Alpha', 'Rack Beta', 'Staging rack']}
        name="rack"
        onValueChange={onValueChange}
      >
        <Autocomplete.InputGroup data-testid="rack-input-group">
          <Autocomplete.Input aria-label="Rack" />
          <Autocomplete.Clear aria-label="Clear rack">Clear</Autocomplete.Clear>
          <Autocomplete.Trigger aria-label="Show suggestions">
            Open
          </Autocomplete.Trigger>
        </Autocomplete.InputGroup>
        <Autocomplete.Portal>
          <Autocomplete.Positioner>
            <Autocomplete.Popup>
              <Autocomplete.Arrow />
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

  const groupRect = document
    .querySelector<HTMLElement>('.tr-autocomplete-input-group')
    ?.getBoundingClientRect();
  const popupRect = document
    .querySelector<HTMLElement>('.tr-autocomplete-popup')
    ?.getBoundingClientRect();
  const triggerRect = document
    .querySelector<HTMLElement>('.tr-autocomplete-trigger')
    ?.getBoundingClientRect();
  const clearRect = document
    .querySelector<HTMLElement>('.tr-autocomplete-clear')
    ?.getBoundingClientRect();
  const arrowRect = document
    .querySelector<HTMLElement>('.tr-autocomplete-arrow')
    ?.getBoundingClientRect();
  expect(
    Math.abs((popupRect?.width ?? 0) - (groupRect?.width ?? 0)),
  ).toBeLessThanOrEqual(1);
  expect(Math.abs((popupRect?.left ?? 0) - (groupRect?.left ?? 0))).toBeLessThanOrEqual(
    1,
  );
  expect(
    Math.abs((triggerRect?.width ?? 0) - (triggerRect?.height ?? 0)),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs((clearRect?.width ?? 0) - (clearRect?.height ?? 0)),
  ).toBeLessThanOrEqual(1);
  expect(arrowRect?.width).toBeGreaterThan(0);
  expect(arrowRect?.height).toBeGreaterThan(0);

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
