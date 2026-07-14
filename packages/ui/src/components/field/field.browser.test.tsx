import './field.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Field, FieldRoot } from './index.js';

test('assembles an accessible Base UI field', async () => {
  expect(Field.Root).toBe(FieldRoot);
  await render(
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>
      <Field.Control required type="email" />
      <Field.Description>Work address</Field.Description>
      <Field.Error match>Please enter an email.</Field.Error>
    </Field.Root>,
  );
  const input = document.querySelector<HTMLInputElement>('.tr-input');
  expect(input?.getAttribute('aria-invalid')).toBe('true');
  expect(document.querySelector('.tr-field-error')?.textContent).toContain('email');
});
