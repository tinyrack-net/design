import './fieldset.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Fieldset, FieldsetRoot } from './index.js';

test('renders the Tinyrack Fieldset wrapper', async () => {
  expect(Fieldset.Root).toBe(FieldsetRoot);
  await render(
    <Fieldset.Root>
      <Fieldset.Legend>Settings</Fieldset.Legend>
    </Fieldset.Root>,
  );
  expect(document.querySelector('.tr-fieldset')).not.toBeNull();
});

test('preserves fieldset semantics, disabled omission, and native reset', async () => {
  await render(
    <form>
      <Fieldset.Root>
        <Fieldset.Legend>Editable rack</Fieldset.Legend>
        <label>
          Name
          <input defaultValue="Rack Alpha" name="rack" />
        </label>
      </Fieldset.Root>
      <Fieldset.Root disabled>
        <Fieldset.Legend>Locked rack</Fieldset.Legend>
        <input defaultValue="secret" name="locked" />
      </Fieldset.Root>
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
