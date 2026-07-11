import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectElementParity } from '../../../e2e/fixtures/component-browser-harness.js';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
} from './react.js';

test.each([
  'select',
  'freeform',
] as const)('Combobox DOM/React part parity for %s mode', async (mode) => {
  const raw = document.createElement('div');
  raw.className = 'tr-combobox';
  raw.dataset['autoSelectOnBlur'] = 'false';
  raw.dataset['mode'] = mode;
  raw.dataset['trCombobox'] = 'true';
  raw.innerHTML =
    '<input autocomplete="off" class="tr-input tr-combobox-input" data-tr-combobox-input="true" role="combobox"><div class="tr-combobox-list" role="listbox"><div aria-selected="false" class="tr-combobox-option" data-value="a" role="option" tabindex="-1">Alpha</div></div><div class="tr-combobox-empty" data-tr-combobox-empty="true" role="status">Empty</div>';
  document.body.append(raw);
  const rendered = await render(
    <Combobox mode={mode}>
      <ComboboxInput />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxOption value="a">Alpha</ComboboxOption>
        </ComboboxList>
        <ComboboxEmpty hidden={false}>Empty</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>,
  );
  const react = rendered.container.querySelector('.tr-combobox')!;
  expectElementParity(raw, react);
  expectElementParity(
    raw.querySelector('[role="combobox"]')!,
    react.querySelector('[role="combobox"]')!,
    {
      ignoreAttributes: [
        'aria-controls',
        'aria-expanded',
        'aria-haspopup',
        'aria-autocomplete',
        'value',
      ],
    },
  );
  expectElementParity(
    raw.querySelector('[role="listbox"]')!,
    react.querySelector('[role="listbox"]')!,
    { ignoreAttributes: ['id'] },
  );
  expectElementParity(
    raw.querySelector('[role="option"]')!,
    react.querySelector('[role="option"]')!,
    { ignoreAttributes: ['id'] },
  );
  expectElementParity(
    raw.querySelector('[role="status"]')!,
    react.querySelector('[role="status"]')!,
  );
  raw.remove();
});
