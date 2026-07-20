import './fieldset.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRFieldset, TRFieldsetRoot } from './index.js';

test('renders the Tinyrack TRFieldset wrapper', async () => {
  expect(TRFieldset.Root).toBe(TRFieldsetRoot);
  await render(
    <TRFieldset.Root>
      <TRFieldset.Legend>Settings</TRFieldset.Legend>
    </TRFieldset.Root>,
  );
  expect(document.querySelector('.tr-fieldset')).not.toBeNull();
});

test('preserves fieldset semantics, disabled omission, and native reset', async () => {
  await render(
    <form>
      <TRFieldset.Root>
        <TRFieldset.Legend>Editable rack</TRFieldset.Legend>
        <label>
          Name
          <input defaultValue="Rack Alpha" name="rack" />
        </label>
      </TRFieldset.Root>
      <TRFieldset.Root disabled>
        <TRFieldset.Legend>Locked rack</TRFieldset.Legend>
        <input defaultValue="secret" name="locked" />
      </TRFieldset.Root>
      <button type="reset">Reset</button>
    </form>,
  );

  const fieldsets = document.querySelectorAll<HTMLFieldSetElement>('fieldset');
  const form = document.querySelector('form') as HTMLFormElement;
  const input = document.querySelector<HTMLInputElement>('input[name="rack"]');
  expect(fieldsets[0]?.textContent).toContain('Editable rack');
  expect(fieldsets[1]?.disabled).toBe(true);
  expect(new FormData(form).get('locked')).toBeNull();

  if (input) input.value = 'Rack Beta';
  form.reset();
  expect(input?.value).toBe('Rack Alpha');
  expect(new FormData(form).get('rack')).toBe('Rack Alpha');
});
