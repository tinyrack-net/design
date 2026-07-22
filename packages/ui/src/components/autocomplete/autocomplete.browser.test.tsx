import '../../core/core.css';
import './autocomplete.css';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  TRAutocomplete,
  type TRAutocompleteFilter,
  type TRAutocompleteFilterOptions,
  TRAutocompleteRoot,
  type TRAutocompleteRootActions,
  type TRAutocompleteRootChangeEventDetails,
} from './index.js';

function FilteredItemsProbe() {
  const items = TRAutocomplete.useFilteredItems<string>();
  return <output data-testid="filtered-items">{items.join(',')}</output>;
}

test('preserves object item inference and public helper types', async () => {
  const items = [{ id: 'alpha', label: 'Rack Alpha' }] as const;
  const actions: TRAutocompleteRootActions = { unmount() {} };
  const options: TRAutocompleteFilterOptions = { sensitivity: 'base' };
  const filter: TRAutocompleteFilter = TRAutocomplete.useFilter(options);
  const onValueChange = vi.fn(
    (_value: string, _details: TRAutocompleteRootChangeEventDetails) => {},
  );

  await render(
    <TRAutocomplete.Root
      actionsRef={{ current: actions }}
      items={items}
      itemToStringValue={(item) => item.label}
      onValueChange={onValueChange}
    >
      <TRAutocomplete.Input aria-label="Object rack" />
      <TRAutocomplete.Value>{(value) => value || 'No rack'}</TRAutocomplete.Value>
      <FilteredItemsProbe />
    </TRAutocomplete.Root>,
  );

  expect(filter.contains('Rack Alpha', 'alpha')).toBe(true);
});

test('renders the Tinyrack TRAutocomplete wrapper', async () => {
  let inputNode: HTMLInputElement | null = null;
  expect(TRAutocomplete.Root).toBe(TRAutocompleteRoot);
  await render(
    <TRAutocomplete.Root items={['Alpha', 'Beta']}>
      <TRAutocomplete.Input
        aria-label="Search"
        ref={(node) => {
          inputNode = node;
        }}
      />
    </TRAutocomplete.Root>,
  );
  expect(document.querySelector('.tr-autocomplete-input')).not.toBeNull();
  expect(inputNode).toBe(document.querySelector('.tr-autocomplete-input'));
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
                <TRAutocomplete.Collection>
                  {(item: string) => (
                    <TRAutocomplete.Item key={item} value={item}>
                      {item}
                    </TRAutocomplete.Item>
                  )}
                </TRAutocomplete.Collection>
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
  expect(
    Array.from(document.querySelectorAll('.tr-autocomplete-item')).map(
      (item) => item.textContent,
    ),
  ).toEqual(['Rack Beta']);

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
  await expect.poll(() => input?.getAttribute('aria-expanded')).toBe('false');
  await expect.poll(() => document.activeElement).toBe(input);
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('Rack Beta');
  expect(
    new FormData(document.querySelector('form') as HTMLFormElement).get('rack'),
  ).toBe('Rack Beta');

  document.querySelector<HTMLButtonElement>('.tr-autocomplete-clear')?.click();
  await expect.poll(() => input?.value).toBe('');
});

test('keeps controlled value, open, and highlighted-item state synchronized', async () => {
  function ControlledAutocomplete() {
    const [highlighted, setHighlighted] = useState('none');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    return (
      <form>
        <TRAutocomplete.Root
          items={['Rack Alpha', 'Rack Beta']}
          onItemHighlighted={(item) => setHighlighted(item ?? 'none')}
          onOpenChange={setOpen}
          onValueChange={setValue}
          open={open}
          value={value}
        >
          <TRAutocomplete.Input aria-label="Controlled rack" />
          <TRAutocomplete.Trigger aria-label="Open controlled rack">
            Open
          </TRAutocomplete.Trigger>
          <TRAutocomplete.Portal>
            <TRAutocomplete.Positioner>
              <TRAutocomplete.Popup>
                <TRAutocomplete.List>
                  <TRAutocomplete.Item value="Rack Alpha">
                    Rack Alpha
                  </TRAutocomplete.Item>
                  <TRAutocomplete.Item value="Rack Beta">Rack Beta</TRAutocomplete.Item>
                </TRAutocomplete.List>
              </TRAutocomplete.Popup>
            </TRAutocomplete.Positioner>
          </TRAutocomplete.Portal>
          <output data-testid="controlled-state">{`${open}:${value}:${highlighted}`}</output>
        </TRAutocomplete.Root>
        <button type="reset">Reset controlled rack</button>
      </form>
    );
  }

  await render(<ControlledAutocomplete />);
  const input = document.querySelector<HTMLInputElement>(
    '[aria-label="Controlled rack"]',
  );
  await userEvent.click(
    document.querySelector<HTMLButtonElement>(
      '[aria-label="Open controlled rack"]',
    ) as HTMLButtonElement,
  );
  await expect.poll(() => input?.getAttribute('aria-expanded')).toBe('true');
  input?.focus();
  await userEvent.keyboard('{ArrowDown}');
  await expect
    .poll(() => document.querySelector('[data-testid="controlled-state"]')?.textContent)
    .toBe('true::Rack Alpha');
  await userEvent.click(
    Array.from(document.querySelectorAll<HTMLElement>('.tr-autocomplete-item')).find(
      (item) => item.textContent === 'Rack Beta',
    ) as HTMLElement,
  );
  await expect.poll(() => input?.value).toBe('Rack Beta');
  await expect.poll(() => input?.getAttribute('aria-expanded')).toBe('false');
  await userEvent.click(
    document.querySelector<HTMLButtonElement>(
      'button[type="reset"]',
    ) as HTMLButtonElement,
  );
  expect(input?.value).toBe('Rack Beta');
});

test('dismisses its portal with Escape and preserves the uncontrolled form reset', async () => {
  const inputRef = createRef<HTMLInputElement>();
  await render(
    <form>
      <TRAutocomplete.Root
        defaultValue="Rack Alpha"
        items={['Rack Alpha', 'Rack Beta']}
        name="rack"
        openOnInputClick
        required
      >
        <TRAutocomplete.Input aria-label="Resettable rack" ref={inputRef} />
        <TRAutocomplete.Portal>
          <TRAutocomplete.Positioner>
            <TRAutocomplete.Popup>
              <TRAutocomplete.List>
                <TRAutocomplete.Item value="Rack Alpha">Rack Alpha</TRAutocomplete.Item>
                <TRAutocomplete.Item value="Rack Beta">Rack Beta</TRAutocomplete.Item>
              </TRAutocomplete.List>
            </TRAutocomplete.Popup>
          </TRAutocomplete.Positioner>
        </TRAutocomplete.Portal>
      </TRAutocomplete.Root>
      <TRAutocomplete.Root items={['Temporary']} name="temporary-rack">
        <TRAutocomplete.Input aria-label="Temporary rack" />
      </TRAutocomplete.Root>
      <button type="reset">Reset rack</button>
    </form>,
  );

  const input = document.querySelector<HTMLInputElement>(
    '[aria-label="Resettable rack"]',
  );
  expect(inputRef.current).toBe(input);
  await userEvent.click(input as HTMLInputElement);
  await expect.poll(() => input?.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => input?.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(input);

  await userEvent.clear(input as HTMLInputElement);
  expect(input?.checkValidity()).toBe(false);
  await userEvent.keyboard('Rack Beta');
  const temporaryInput = document.querySelector<HTMLInputElement>(
    '[aria-label="Temporary rack"]',
  );
  temporaryInput?.focus();
  await userEvent.keyboard('Temporary');
  expect(new FormData(input?.form as HTMLFormElement).get('rack')).toBe('Rack Beta');
  await userEvent.click(
    document.querySelector('button[type="reset"]') as HTMLButtonElement,
  );
  await expect
    .poll(
      () =>
        document.querySelector<HTMLInputElement>('[aria-label="Resettable rack"]')
          ?.value,
    )
    .toBe('Rack Alpha');
  await expect
    .poll(
      () =>
        document.querySelector<HTMLInputElement>('[aria-label="Temporary rack"]')
          ?.value,
    )
    .toBe('');
  expect(inputRef.current?.checkValidity()).toBe(true);
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
      <TRAutocomplete.Root disabled items={['Rack Alpha']}>
        <TRAutocomplete.Input aria-label="Disabled rack" />
        <TRAutocomplete.Trigger aria-label="Open disabled rack">
          Open
        </TRAutocomplete.Trigger>
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
  expect(
    document.querySelector<HTMLInputElement>('[aria-label="Disabled rack"]')?.disabled,
  ).toBe(true);
  expect(
    document.querySelector<HTMLButtonElement>('[aria-label="Open disabled rack"]')
      ?.disabled,
  ).toBe(true);
  const disabledItem = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-autocomplete-item'),
  ).find((item) => item.textContent === 'Rack Gamma');
  expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
  disabledItem?.click();
  expect(
    document.querySelector<HTMLInputElement>('[aria-label="Selectable rack"]')?.value,
  ).toBe('');
});

test('forwards uiSize to InputGroup and aligns inner Input height', async () => {
  await render(
    <TRAutocomplete.Root items={['Alpha', 'Beta']}>
      <TRAutocomplete.InputGroup data-testid="sized-autocomplete-group" uiSize="sm">
        <TRAutocomplete.Input aria-label="Sized autocomplete" />
        <TRAutocomplete.Trigger aria-label="Open sized autocomplete">
          Open
        </TRAutocomplete.Trigger>
      </TRAutocomplete.InputGroup>
    </TRAutocomplete.Root>,
  );

  const group = document.querySelector<HTMLDivElement>(
    '[data-testid="sized-autocomplete-group"]',
  );
  expect(group?.getAttribute('data-ui-size')).toBe('sm');
  const input = document.querySelector<HTMLInputElement>(
    '[aria-label="Sized autocomplete"]',
  );
  const trigger = document.querySelector<HTMLButtonElement>(
    '[aria-label="Open sized autocomplete"]',
  );
  expect(input?.getBoundingClientRect().height).toBe(32);
  expect(trigger?.getBoundingClientRect().height).toBe(32);
});
