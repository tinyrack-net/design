import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createAlertDialogHandle, TRAlertDialog } from './alert-dialog/index.js';
import {
  TRAutocomplete,
  useAutocompleteFilter,
  useAutocompleteFilteredItems,
} from './autocomplete/index.js';
import {
  TRCombobox,
  useComboboxFilter,
  useComboboxFilteredItems,
} from './combobox/index.js';
import { createDialogHandle, TRDialog } from './dialog/index.js';
import { createDrawerHandle, TRDrawer } from './drawer/index.js';
import { createMenuHandle, TRMenu } from './menu/index.js';
import { createPopoverHandle, TRPopover } from './popover/index.js';
import { createPreviewCardHandle, TRPreviewCard } from './preview-card/index.js';
import { createTooltipHandle, TRTooltip } from './tooltip/index.js';

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
      <TRAutocomplete.Root items={['Rack alpha']}>
        <AutocompleteFilterProbe />
      </TRAutocomplete.Root>
      <TRCombobox.Root items={['Rack alpha']}>
        <ComboboxFilterProbe />
      </TRCombobox.Root>
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

  expect(TRAlertDialog.Root).toBeTypeOf('function');
  expect(TRDialog.Root).toBeTypeOf('function');
  expect(TRDrawer.Root).toBeTypeOf('function');
  expect(TRMenu.Root).toBeTypeOf('function');
  expect(TRPopover.Root).toBeTypeOf('function');
  expect(TRPreviewCard.Root).toBeTypeOf('function');
  expect(TRTooltip.Root).toBeTypeOf('function');
});
