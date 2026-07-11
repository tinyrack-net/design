import '../../core/core.css';
import './form.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import {
  formControlSizes,
  formMessageVariants,
  radioGroupAppearances,
  radioGroupOrientations,
} from './contract.js';

test.each(formControlSizes)('raw text and choice controls support size %s', (size) => {
  const input = createRawElement('input', {
    className: 'tr-input',
    data: { invalid: 'true', size },
  });
  const textarea = createRawElement('textarea', {
    className: 'tr-textarea',
    data: { autosize: 'true', maxRows: '5', minRows: '2', size },
  });
  const select = createRawElement('select', { className: 'tr-select', data: { size } });
  const checkbox = createRawElement('label', {
    className: 'tr-checkbox',
    data: { invalid: 'true', size },
  });
  checkbox.innerHTML =
    '<input class="tr-checkbox-input" type="checkbox"><span aria-hidden="true" class="tr-checkbox-control"></span><span class="tr-checkbox-label">Enabled</span>';
  expect(input.dataset).toMatchObject({ invalid: 'true', size });
  expect(textarea.rows).toBe(2);
  expect(select.dataset['size']).toBe(size);
  expect(checkbox.querySelector('input')).toHaveAttribute('type', 'checkbox');
  input.remove();
  textarea.remove();
  select.remove();
  checkbox.remove();
});

test.each(
  radioGroupAppearances.flatMap((appearance) =>
    radioGroupOrientations.map((orientation) => [appearance, orientation] as const),
  ),
)('raw RadioGroup supports %s/%s', (appearance, orientation) => {
  const group = createRawElement('fieldset', {
    className: 'tr-radio-group',
    data: { appearance, orientation },
  });
  expect(group.dataset).toMatchObject({ appearance, orientation });
  group.remove();
});

test.each(formMessageVariants)('raw FormMessage supports %s', (variant) => {
  const message = createRawElement('p', {
    className: 'tr-form-message',
    data: { variant },
    text: 'Message',
  });
  expect(message.dataset['variant']).toBe(variant);
  message.remove();
});
