import './form.css';
import { createRef, useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRField } from '../field/index.js';
import {
  TRForm,
  type TRFormActions,
  type TRFormSubmitEventDetails,
  type TRFormSubmitEventReason,
} from './index.js';

const submitReason: TRFormSubmitEventReason = 'none';
const readSubmitDetails = (details: TRFormSubmitEventDetails) => details.reason;

test('renders the Tinyrack TRForm wrapper', async () => {
  expect(typeof TRForm).toBe('function');
  await render(
    <TRForm aria-label="Example form">
      <button type="submit">Submit</button>
    </TRForm>,
  );
  expect(document.querySelector('.tr-form')).not.toBeNull();
});

test('preserves the TRFormValues generic through onFormSubmit', async () => {
  const submitted: string[] = [];
  const reasons: TRFormSubmitEventReason[] = [];
  await render(
    <TRForm<{ rack: string }>
      onFormSubmit={(values, details) => {
        submitted.push(values.rack.toUpperCase());
        reasons.push(readSubmitDetails(details));
      }}
    >
      <TRField.Root name="rack">
        <TRField.Label>Typed rack</TRField.Label>
        <TRField.Control defaultValue="rack-alpha" />
      </TRField.Root>
      <button type="submit">Submit typed rack</button>
    </TRForm>,
  );
  document.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
  await expect.poll(() => submitted).toEqual(['RACK-ALPHA']);
  expect(reasons).toEqual([submitReason]);
});

test('submits named values and restores defaults through native reset', async () => {
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) =>
    event.preventDefault(),
  );
  const onReset = vi.fn();
  await render(
    <TRForm aria-label="Rack form" onReset={onReset} onSubmit={onSubmit}>
      <label>
        Rack
        <input defaultValue="Rack Alpha" name="rack" />
      </label>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
    </TRForm>,
  );

  const form = document.querySelector('form') as HTMLFormElement;
  const input = document.querySelector<HTMLInputElement>('input[name="rack"]');
  await userEvent.fill(input as HTMLInputElement, 'Rack Beta');
  await userEvent.click(
    document.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    ) as HTMLButtonElement,
  );
  expect(onSubmit).toHaveBeenCalledOnce();
  expect(new FormData(form).get('rack')).toBe('Rack Beta');

  await userEvent.click(
    document.querySelector<HTMLButtonElement>(
      'button[type="reset"]',
    ) as HTMLButtonElement,
  );
  expect(onReset).toHaveBeenCalledOnce();
  expect(input?.value).toBe('Rack Alpha');
});

test('leaves controlled values with the application when reset is requested', async () => {
  const onReset = vi.fn();
  function ControlledForm() {
    const [value, setValue] = useState('Rack Alpha');
    return (
      <TRForm onReset={onReset}>
        <label>
          Rack
          <input
            name="rack"
            onChange={(event) => setValue(event.currentTarget.value)}
            value={value}
          />
        </label>
        <button type="reset">Reset controlled form</button>
      </TRForm>
    );
  }

  await render(<ControlledForm />);
  const input = document.querySelector<HTMLInputElement>('input[name="rack"]');
  await userEvent.fill(input as HTMLInputElement, 'Rack Beta');
  await userEvent.click(
    document.querySelector<HTMLButtonElement>(
      'button[type="reset"]',
    ) as HTMLButtonElement,
  );
  expect(onReset).toHaveBeenCalledOnce();
  expect(input?.value).toBe('Rack Beta');
});

test('associates Base UI server errors and clears them after a successful retry', async () => {
  const onFormSubmit = vi.fn();
  function ServerErrorForm() {
    const [errors, setErrors] = useState({ rack: 'Rack already exists.' });
    return (
      <TRForm errors={errors} onFormSubmit={onFormSubmit}>
        <TRField.Root name="rack">
          <TRField.Label>Rack</TRField.Label>
          <TRField.Control
            defaultValue="Rack Alpha"
            onChange={() => setErrors({ rack: '' })}
          />
          <TRField.Error />
        </TRField.Root>
        <button type="submit">Retry</button>
      </TRForm>
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

test('validates through actionsRef and focuses the first invalid field on submit', async () => {
  function ActionsForm() {
    const actionsRef = useRef<TRFormActions>(null);
    return (
      <TRForm actionsRef={actionsRef}>
        <TRField.Root name="rack">
          <TRField.Label>Rack</TRField.Label>
          <TRField.Control required />
          <TRField.Error match="valueMissing">Enter a rack.</TRField.Error>
        </TRField.Root>
        <TRField.Root name="region">
          <TRField.Label>Region</TRField.Label>
          <TRField.Control required />
          <TRField.Error match="valueMissing">Enter a region.</TRField.Error>
        </TRField.Root>
        <button onClick={() => actionsRef.current?.validate('region')} type="button">
          Validate region
        </button>
        <button type="submit">Submit</button>
      </TRForm>
    );
  }

  await render(<ActionsForm />);
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input'));
  document.querySelector<HTMLButtonElement>('button[type="button"]')?.click();
  await expect.poll(() => inputs[1]?.getAttribute('aria-invalid')).toBe('true');
  expect(inputs[0]?.getAttribute('aria-invalid')).not.toBe('true');
  expect(document.body.textContent).toContain('Enter a region.');

  document.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
  await expect.poll(() => document.activeElement).toBe(inputs[0]);
  expect(document.body.textContent).toContain('Enter a rack.');
});

test('merges render, refs, classes, styles, and native form props', async () => {
  const ref = createRef<HTMLFormElement>();
  await render(
    <TRForm
      aria-label="Rendered form"
      className="consumer-form"
      data-consumer="form"
      ref={ref}
      render={<form method="post" />}
      style={{ gap: 'var(--tinyrack-space-lg)' }}
    />,
  );
  expect(ref.current).toHaveClass('tr-form', 'consumer-form');
  expect(ref.current?.dataset['consumer']).toBe('form');
  expect(ref.current?.method).toBe('post');
  expect(ref.current?.style.gap).toBe('var(--tinyrack-space-lg)');
  expect(getComputedStyle(ref.current as HTMLFormElement).display).toBe('grid');
});
