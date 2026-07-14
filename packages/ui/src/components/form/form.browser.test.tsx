import './form.css';
import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Field } from '../field/index.js';
import { Form } from './index.js';

test('renders the Tinyrack Form wrapper', async () => {
  expect(typeof Form).toBe('function');
  await render(
    <Form aria-label="Example form">
      <button type="submit">Submit</button>
    </Form>,
  );
  expect(document.querySelector('.tr-form')).not.toBeNull();
});

test('submits named values and restores defaults through native reset', async () => {
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) =>
    event.preventDefault(),
  );
  await render(
    <Form aria-label="Rack form" onSubmit={onSubmit}>
      <label>
        Rack
        <input defaultValue="Rack Alpha" name="rack" />
      </label>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
    </Form>,
  );

  const form = document.querySelector('form') as HTMLFormElement;
  const input = document.querySelector<HTMLInputElement>('input[name="rack"]');
  if (input) input.value = 'Rack Beta';
  document.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
  expect(onSubmit).toHaveBeenCalledOnce();
  expect(new FormData(form).get('rack')).toBe('Rack Beta');

  form.reset();
  expect(input?.value).toBe('Rack Alpha');
});

test('associates Base UI server errors and clears them after a successful retry', async () => {
  const onFormSubmit = vi.fn();
  function ServerErrorForm() {
    const [errors, setErrors] = useState({ rack: 'Rack already exists.' });
    return (
      <Form errors={errors} onFormSubmit={onFormSubmit}>
        <Field.Root name="rack">
          <Field.Label>Rack</Field.Label>
          <Field.Control
            defaultValue="Rack Alpha"
            onChange={() => setErrors({ rack: '' })}
          />
          <Field.Error />
        </Field.Root>
        <button type="submit">Retry</button>
      </Form>
    );
  }

  await render(<ServerErrorForm />);
  const input = document.querySelector<HTMLInputElement>('input[name="rack"]');
  const error = document.querySelector<HTMLElement>('.tr-field-error');
  expect(error?.textContent).toBe('Rack already exists.');
  expect(input?.getAttribute('aria-describedby')).toContain(error?.id);

  await userEvent.fill(input as HTMLInputElement, 'Rack Beta');
  await expect
    .poll(() => document.querySelector('.tr-field-error')?.textContent ?? '')
    .toBe('');
  document.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
  await expect.poll(() => onFormSubmit.mock.calls.length).toBe(1);
  expect(onFormSubmit.mock.calls[0]?.[0]).toMatchObject({ rack: 'Rack Beta' });
});
