import '../../core/core.css';
import './autocomplete.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRAutocomplete, TRAutocompleteRoot } from './index.js';

test('renders the Tinyrack TRAutocomplete wrapper', async () => {
  expect(TRAutocomplete.Root).toBe(TRAutocompleteRoot);
  await render(
    <TRAutocomplete.Root items={['Alpha', 'Beta']}>
      <TRAutocomplete.Input aria-label="Search" />
    </TRAutocomplete.Root>,
  );
  expect(document.querySelector('.tr-autocomplete-input')).not.toBeNull();
});

test('centers an input adornment and supports the end side', async () => {
  const adornmentRef = createRef<HTMLSpanElement>();
  await render(
    <TRAutocomplete.Root items={['Alpha']}>
      <TRAutocomplete.InputGroup data-testid="adorned-input-group">
        <TRAutocomplete.Input aria-label="Adorned search" />
        <TRAutocomplete.InputAdornment
          aria-hidden="true"
          className="custom-adornment"
          data-testid="input-adornment"
          ref={adornmentRef}
          side="end"
        >
          Search
        </TRAutocomplete.InputAdornment>
      </TRAutocomplete.InputGroup>
    </TRAutocomplete.Root>,
  );

  const group = document.querySelector<HTMLElement>(
    '[data-testid="adorned-input-group"]',
  );
  const adornment = document.querySelector<HTMLElement>(
    '[data-testid="input-adornment"]',
  );
  expect(adornmentRef.current).toBe(adornment);
  expect(adornment).toHaveClass(
    'tr-input-group-adornment',
    'tr-autocomplete-input-adornment',
    'custom-adornment',
  );
  expect(adornment).toHaveAttribute('data-side', 'end');

  const groupRect = group?.getBoundingClientRect();
  const adornmentRect = adornment?.getBoundingClientRect();
  expect(
    Math.abs(
      (adornmentRect?.top ?? 0) +
        (adornmentRect?.height ?? 0) / 2 -
        ((groupRect?.top ?? 0) + (groupRect?.height ?? 0) / 2),
    ),
  ).toBeLessThanOrEqual(1);
});

test('filters, selects with the keyboard, and submits the native value', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const onValueChange = vi.fn();
  await render(
    <form style={{ marginInline: '2rem', width: '16rem' }}>
      <TRAutocomplete.Root
        items={['Rack Alpha', 'Rack Beta', 'Staging rack']}
        name="rack"
        onValueChange={onValueChange}
      >
        <TRAutocomplete.InputGroup data-testid="rack-input-group">
          <TRAutocomplete.Input aria-label="Rack" />
          <TRAutocomplete.Clear aria-label="Clear rack">Clear</TRAutocomplete.Clear>
          <TRAutocomplete.Trigger aria-label="Show suggestions">
            Open
          </TRAutocomplete.Trigger>
        </TRAutocomplete.InputGroup>
        <TRAutocomplete.Portal>
          <TRAutocomplete.Positioner>
            <TRAutocomplete.Popup>
              <TRAutocomplete.Arrow />
              <TRAutocomplete.List>
                <TRAutocomplete.Item value="Rack Alpha">Rack Alpha</TRAutocomplete.Item>
                <TRAutocomplete.Item value="Rack Beta">Rack Beta</TRAutocomplete.Item>
                <TRAutocomplete.Item value="Staging rack">
                  Staging rack
                </TRAutocomplete.Item>
                <TRAutocomplete.Empty>No matching racks</TRAutocomplete.Empty>
              </TRAutocomplete.List>
            </TRAutocomplete.Popup>
          </TRAutocomplete.Positioner>
        </TRAutocomplete.Portal>
      </TRAutocomplete.Root>
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
  input?.focus();
  await userEvent.keyboard('{ArrowDown}');
  const highlighted = document.querySelector<HTMLElement>(
    '.tr-autocomplete-item[data-highlighted]',
  );
  expect(getComputedStyle(highlighted as HTMLElement).outlineStyle).toBe('solid');
  await userEvent.click(beta as HTMLElement);
  await expect.poll(() => input?.value).toBe('Rack Beta');
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('Rack Beta');
  expect(
    new FormData(document.querySelector('form') as HTMLFormElement).get('rack'),
  ).toBe('Rack Beta');

  document.querySelector<HTMLButtonElement>('.tr-autocomplete-clear')?.click();
  await expect.poll(() => input?.value).toBe('');
});

test('removes the clear action from a read-only input and keeps disabled items inert', async () => {
  await render(
    <div data-theme="tinyrack-light">
      <TRAutocomplete.Root defaultValue="Rack Alpha" items={['Rack Alpha']} readOnly>
        <TRAutocomplete.InputGroup>
          <TRAutocomplete.Input aria-label="Read-only rack" />
          <TRAutocomplete.Clear aria-label="Clear read-only rack">
            Clear
          </TRAutocomplete.Clear>
        </TRAutocomplete.InputGroup>
      </TRAutocomplete.Root>
      <TRAutocomplete.Root defaultOpen items={['Rack Alpha', 'Rack Gamma']}>
        <TRAutocomplete.Input aria-label="Selectable rack" />
        <TRAutocomplete.Portal>
          <TRAutocomplete.Positioner>
            <TRAutocomplete.Popup>
              <TRAutocomplete.List>
                <TRAutocomplete.Item value="Rack Alpha">Rack Alpha</TRAutocomplete.Item>
                <TRAutocomplete.Item disabled value="Rack Gamma">
                  Rack Gamma
                </TRAutocomplete.Item>
              </TRAutocomplete.List>
            </TRAutocomplete.Popup>
          </TRAutocomplete.Positioner>
        </TRAutocomplete.Portal>
      </TRAutocomplete.Root>
    </div>,
  );

  const clear = document.querySelector<HTMLElement>(
    '[aria-label="Clear read-only rack"]',
  );
  expect(getComputedStyle(clear as HTMLElement).display).toBe('none');
  const disabledItem = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-autocomplete-item'),
  ).find((item) => item.textContent === 'Rack Gamma');
  expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
  disabledItem?.click();
  expect(
    document.querySelector<HTMLInputElement>('[aria-label="Selectable rack"]')?.value,
  ).toBe('');
});
