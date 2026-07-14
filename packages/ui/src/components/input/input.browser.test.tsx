import './input.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Input } from './index.js';

test('renders the Tinyrack Input wrapper', async () => {
  expect(typeof Input).toBe('function');
  await render(<Input aria-label="Name" defaultValue="Tinyrack" />);
  expect(document.querySelector('.tr-input')).not.toBeNull();
});

test('forwards refs and native events, FormData, readonly, disabled, and reset', async () => {
  const ref = createRef<HTMLInputElement>();
  const onChange = vi.fn();
  await render(
    <form>
      <label htmlFor="rack-name">Rack name</label>
      <Input
        defaultValue="Rack Alpha"
        id="rack-name"
        name="rack"
        onChange={onChange}
        ref={ref}
      />
      <Input aria-label="Readonly rack" defaultValue="Locked" readOnly />
      <Input aria-label="Disabled rack" defaultValue="Hidden" disabled name="hidden" />
      <button type="reset">Reset</button>
    </form>,
  );

  expect(ref.current?.classList.contains('tr-input')).toBe(true);
  ref.current?.focus();
  await userEvent.keyboard(' Beta');
  expect(onChange).toHaveBeenCalled();
  expect(ref.current?.value).toBe('Rack Alpha Beta');
  const form = document.querySelector('form') as HTMLFormElement;
  expect(new FormData(form).get('rack')).toBe('Rack Alpha Beta');
  expect(new FormData(form).get('hidden')).toBeNull();

  const readOnly = document.querySelector<HTMLInputElement>('input[readonly]');
  readOnly?.focus();
  await userEvent.keyboard(' change');
  expect(readOnly?.value).toBe('Locked');
  form.reset();
  expect(ref.current?.value).toBe('Rack Alpha');
});
