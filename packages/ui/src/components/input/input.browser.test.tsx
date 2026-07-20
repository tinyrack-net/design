import '../../core/core.css';
import './input.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRInput } from './index.js';

test('renders the Tinyrack TRInput wrapper', async () => {
  expect(typeof TRInput).toBe('function');
  await render(<TRInput aria-label="Name" defaultValue="Tinyrack" />);
  expect(document.querySelector('.tr-input')).not.toBeNull();
});

test('supports compact ui size without changing native input behavior', async () => {
  await render(<TRInput aria-label="Compact name" uiSize="sm" />);
  const input = document.querySelector<HTMLInputElement>('.tr-input');
  expect(input?.dataset['uiSize']).toBe('sm');
  expect(getComputedStyle(input as HTMLInputElement).minHeight).toBe('32px');
});

test('reports string values and merges behavior onto a rendered native input', async () => {
  const onValueChange = vi.fn();
  await render(
    <TRInput
      aria-label="Rendered rack"
      onValueChange={onValueChange}
      render={<input data-consumer-input="" />}
    />,
  );
  const input = document.querySelector<HTMLInputElement>('[data-consumer-input]');
  input?.focus();
  await userEvent.keyboard('Rack Alpha');
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('Rack Alpha');
  expect(input).toHaveClass('tr-input');
});

test('forwards refs and native events, FormData, readonly, disabled, and reset', async () => {
  const ref = createRef<HTMLInputElement>();
  const onChange = vi.fn();
  await render(
    <form>
      <label htmlFor="rack-name">Rack name</label>
      <TRInput
        defaultValue="Rack Alpha"
        id="rack-name"
        name="rack"
        onChange={onChange}
        ref={ref}
      />
      <TRInput aria-label="Readonly rack" defaultValue="Locked" readOnly />
      <TRInput
        aria-label="Disabled rack"
        defaultValue="Hidden"
        disabled
        name="hidden"
      />
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
