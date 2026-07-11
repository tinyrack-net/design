import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { formControlSizes } from './contract.js';
import { Checkbox, Input, Select, Textarea } from './react.js';

test.each(
  formControlSizes,
)('Form DOM/React text control parity for size %s', async (size) => {
  const rawInput = createRawElement('input', {
    attributes: { 'aria-invalid': 'true' },
    className: 'tr-input',
    data: { invalid: 'true', size },
  });
  const rawTextarea = createRawElement('textarea', {
    attributes: { 'aria-invalid': 'true' },
    className: 'tr-textarea',
    data: { autosize: 'true', invalid: 'true', maxRows: '5', minRows: '2', size },
  });
  rawTextarea.rows = 2;
  rawTextarea.style.maxHeight = '5lh';
  const rawSelect = createRawElement('select', {
    attributes: { 'aria-invalid': 'true' },
    className: 'tr-select',
    data: { invalid: 'true', size },
  });
  const rendered = await render(
    <>
      <Input invalid size={size} />
      <Textarea autosize invalid maxRows={5} minRows={2} size={size} />
      <Select invalid size={size} />
    </>,
  );
  expectElementParity(rawInput, rendered.container.querySelector('.tr-input')!);
  expectElementParity(rawTextarea, rendered.container.querySelector('.tr-textarea')!, {
    ignoreAttributes: ['style'],
  });
  expectElementParity(rawSelect, rendered.container.querySelector('.tr-select')!);
  rawInput.remove();
  rawTextarea.remove();
  rawSelect.remove();
});

test.each(
  formControlSizes,
)('Form DOM/React Checkbox part parity for size %s', async (size) => {
  const raw = createRawElement('label', {
    className: 'tr-checkbox',
    data: { invalid: 'true', size },
  });
  raw.innerHTML =
    '<input aria-invalid="true" class="tr-checkbox-input" type="checkbox"><span aria-hidden="true" class="tr-checkbox-control"></span><span class="tr-checkbox-label">Enabled</span>';
  const rendered = await render(
    <Checkbox invalid size={size}>
      Enabled
    </Checkbox>,
  );
  const react = rendered.container.querySelector('.tr-checkbox')!;
  expectElementParity(raw, react);
  expectElementParity(raw.querySelector('input')!, react.querySelector('input')!);
  raw.remove();
});
