import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { AlertDialog, createAlertDialogHandle } from './alert-dialog/index.js';
import {
  Autocomplete,
  useAutocompleteFilter,
  useAutocompleteFilteredItems,
} from './autocomplete/index.js';
import {
  Combobox,
  useComboboxFilter,
  useComboboxFilteredItems,
} from './combobox/index.js';
import { createDialogHandle, Dialog } from './dialog/index.js';
import { createDrawerHandle, Drawer } from './drawer/index.js';
import { createMenuHandle, Menu } from './menu/index.js';
import { createPopoverHandle, Popover } from './popover/index.js';
import { createPreviewCardHandle, PreviewCard } from './preview-card/index.js';
import { createTooltipHandle, Tooltip } from './tooltip/index.js';

function AutocompleteFilterProbe() {
  const filter = useAutocompleteFilter();
  const items = useAutocompleteFilteredItems();
  return (
    <output data-testid="autocomplete-filter">
      {String(filter.contains('Rack alpha', 'alpha'))}:{items.length}
    </output>
  );
}

function ComboboxFilterProbe() {
  const filter = useComboboxFilter();
  const items = useComboboxFilteredItems();
  return (
    <output data-testid="combobox-filter">
      {String(filter.startsWith('Rack alpha', 'rack'))}:{items.length}
    </output>
  );
}

test('forwards the Base UI filter adapters', async () => {
  const screen = await render(
    <>
      <Autocomplete.Root items={['Rack alpha']}>
        <AutocompleteFilterProbe />
      </Autocomplete.Root>
      <Combobox.Root items={['Rack alpha']}>
        <ComboboxFilterProbe />
      </Combobox.Root>
    </>,
  );

  await expect
    .element(screen.getByTestId('autocomplete-filter'))
    .toHaveTextContent('true:1');
  await expect
    .element(screen.getByTestId('combobox-filter'))
    .toHaveTextContent('true:1');
});

test('creates imperative handles for every supported Base UI surface', () => {
  const handles = [
    createAlertDialogHandle(),
    createDialogHandle(),
    createDrawerHandle(),
    createMenuHandle(),
    createPopoverHandle(),
    createPreviewCardHandle(),
    createTooltipHandle(),
  ];

  expect(handles).toHaveLength(7);
  for (const handle of handles) {
    expect(handle).toBeTypeOf('object');
  }

  expect(AlertDialog.Root).toBeTypeOf('function');
  expect(Dialog.Root).toBeTypeOf('function');
  expect(Drawer.Root).toBeTypeOf('function');
  expect(Menu.Root).toBeTypeOf('function');
  expect(Popover.Root).toBeTypeOf('function');
  expect(PreviewCard.Root).toBeTypeOf('function');
  expect(Tooltip.Root).toBeTypeOf('function');
});
