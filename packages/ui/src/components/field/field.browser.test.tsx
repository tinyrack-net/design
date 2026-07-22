import '../../core/core.css';
import './field.css';
import { act, type CSSProperties, createRef, useRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRForm } from '../form/index.js';
import {
  TRField,
  TRFieldControl,
  type TRFieldControlChangeEventDetails,
  TRFieldDescription,
  TRFieldError,
  TRFieldItem,
  TRFieldLabel,
  TRFieldRoot,
  type TRFieldRootActions,
  TRFieldValidity,
  type TRFieldValidityData,
} from './index.js';

test('exports the complete Base UI anatomy and public supporting types', () => {
  expect(TRField).toEqual({
    Root: TRFieldRoot,
    Label: TRFieldLabel,
    Error: TRFieldError,
    Description: TRFieldDescription,
    Control: TRFieldControl,
    Validity: TRFieldValidity,
    Item: TRFieldItem,
  });

  const actionsRef = createRef<TRFieldRootActions>();
  const acceptValidity = (_validity: TRFieldValidityData) => undefined;
  const acceptChangeDetails = (_details: TRFieldControlChangeEventDetails) => undefined;
  expect(actionsRef.current).toBeNull();
  expect(acceptValidity).toBeTypeOf('function');
  expect(acceptChangeDetails).toBeTypeOf('function');
});

test('associates its label, description, and visible error with the control', async () => {
  await render(
    <TRField.Root invalid>
      <TRField.Label>Email</TRField.Label>
      <TRField.Control required type="email" />
      <TRField.Description>Work address</TRField.Description>
      <TRField.Error match>Enter a valid email.</TRField.Error>
    </TRField.Root>,
  );

  const input = page.getByRole('textbox', { name: 'Email' }).element();
  const description = document.querySelector<HTMLElement>('.tr-field-description');
  const error = document.querySelector<HTMLElement>('.tr-field-error');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual(
    expect.arrayContaining([description?.id, error?.id]),
  );

  input.blur();
  document.querySelector<HTMLLabelElement>('.tr-label')?.click();
  expect(document.activeElement).toBe(input);
});

test('forwards every host ref and preserves consumer classes, styles, and events', async () => {
  const rootRef = createRef<HTMLDivElement>();
  const labelRef = createRef<HTMLLabelElement>();
  const controlRef = createRef<HTMLInputElement>();
  const descriptionRef = createRef<HTMLParagraphElement>();
  const itemRef = createRef<HTMLDivElement>();
  const errorRef = createRef<HTMLDivElement>();
  const onChange = vi.fn();

  await render(
    <TRField.Root
      className={(state) => (state.focused ? 'consumer-focused' : 'consumer-field')}
      ref={rootRef}
      style={{ '--tr-field-gap': 'var(--tinyrack-space-lg)' } as CSSProperties}
    >
      <TRField.Label className="consumer-label" ref={labelRef}>
        Rack
      </TRField.Label>
      <TRField.Control
        className="consumer-control"
        data-consumer="control"
        onChange={onChange}
        ref={controlRef}
      />
      <TRField.Description ref={descriptionRef}>Rack identifier</TRField.Description>
      <TRField.Item ref={itemRef}>Item</TRField.Item>
      <TRField.Error match ref={errorRef}>
        Invalid rack
      </TRField.Error>
    </TRField.Root>,
  );

  expect(rootRef.current).toHaveClass('tr-field', 'consumer-field');
  expect(labelRef.current).toHaveClass('tr-label', 'consumer-label');
  expect(controlRef.current).toHaveClass('tr-field-control', 'consumer-control');
  expect(controlRef.current).not.toHaveClass('tr-input');
  expect(controlRef.current?.dataset['consumer']).toBe('control');
  expect(descriptionRef.current).toHaveClass('tr-field-description');
  expect(itemRef.current).toHaveClass('tr-field-item');
  expect(errorRef.current).toHaveClass('tr-field-error');

  controlRef.current?.focus();
  await userEvent.keyboard('rack-a');
  expect(onChange).toHaveBeenCalled();
  await expect
    .poll(() => rootRef.current?.classList.contains('consumer-focused'))
    .toBe(true);
});

test('supports controlled values, onValueChange details, FormData, and native reset', async () => {
  const onValueChange = vi.fn();

  function ControlledField() {
    const [value, setValue] = useState('rack-controlled');
    return (
      <TRField.Root name="controlled-rack">
        <TRField.Label>Controlled rack</TRField.Label>
        <TRField.Control
          onValueChange={(nextValue, details) => {
            onValueChange(nextValue, details);
            setValue(nextValue);
          }}
          value={value}
        />
      </TRField.Root>
    );
  }

  await render(
    <form>
      <TRField.Root name="rack">
        <TRField.Label>Rack</TRField.Label>
        <TRField.Control defaultValue="rack-alpha" />
      </TRField.Root>
      <ControlledField />
      <button type="reset">Reset</button>
    </form>,
  );

  const uncontrolled = page
    .getByRole('textbox', { exact: true, name: 'Rack' })
    .element();
  const controlled = page.getByRole('textbox', { name: 'Controlled rack' }).element();
  const form = document.querySelector('form') as HTMLFormElement;

  await userEvent.fill(uncontrolled, 'rack-beta');
  await userEvent.fill(controlled, 'rack-next');
  expect(new FormData(form).get('rack')).toBe('rack-beta');
  expect(new FormData(form).get('controlled-rack')).toBe('rack-next');
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('rack-next');
  expect(onValueChange.mock.calls.at(-1)?.[1]).toMatchObject({ reason: 'none' });

  form.reset();
  expect(uncontrolled).toHaveValue('rack-alpha');
  expect(controlled).toHaveValue('rack-next');
});

test('propagates disabled state and preserves readonly focus and values', async () => {
  await render(
    <form>
      <TRField.Root disabled name="disabled-rack">
        <TRField.Label>Disabled rack</TRField.Label>
        <TRField.Control defaultValue="hidden" />
        <TRField.Description>Unavailable</TRField.Description>
      </TRField.Root>
      <TRField.Root name="readonly-rack">
        <TRField.Label>Readonly rack</TRField.Label>
        <TRField.Control defaultValue="locked" readOnly />
      </TRField.Root>
    </form>,
  );

  const disabled = page.getByRole('textbox', { name: 'Disabled rack' }).element();
  const readOnly = page.getByRole('textbox', { name: 'Readonly rack' }).element();
  const form = document.querySelector('form') as HTMLFormElement;
  expect(disabled).toBeDisabled();
  expect(disabled.closest('.tr-field')).toHaveAttribute('data-disabled');
  expect(new FormData(form).has('disabled-rack')).toBe(false);

  readOnly.focus();
  await userEvent.keyboard(' change');
  expect(document.activeElement).toBe(readOnly);
  expect(readOnly).toHaveValue('locked');
  expect(new FormData(form).get('readonly-rack')).toBe('locked');
});

test('validates on blur, exposes validity, error matching, state, and imperative validation', async () => {
  const states: Array<{
    dirty: boolean;
    filled: boolean;
    touched: boolean;
    valid: boolean | null;
  }> = [];

  function ValidationField() {
    const actionsRef = useRef<TRFieldRootActions>(null);
    return (
      <TRForm>
        <TRField.Root
          actionsRef={actionsRef}
          className={(state) => {
            states.push({
              dirty: state.dirty,
              filled: state.filled,
              touched: state.touched,
              valid: state.valid,
            });
            return 'validation-field';
          }}
          name="slug"
          validate={(value) => (value === 'taken' ? 'Slug is already in use.' : null)}
          validationMode="onBlur"
        >
          <TRField.Label>Slug</TRField.Label>
          <TRField.Control required />
          <TRField.Error match="valueMissing">Slug is required.</TRField.Error>
          <TRField.Error>Validation failed.</TRField.Error>
          <TRField.Validity>
            {(state) => (
              <output
                data-error={state.error}
                data-valid={String(state.validity.valid)}
              >
                {state.errors.join(', ')}
              </output>
            )}
          </TRField.Validity>
          <button onClick={() => actionsRef.current?.validate()} type="button">
            Validate
          </button>
        </TRField.Root>
      </TRForm>
    );
  }

  await render(<ValidationField />);
  const input = page.getByRole('textbox', { name: 'Slug' }).element();
  await userEvent.fill(input, 'x');
  await userEvent.clear(input);
  await userEvent.tab();
  await expect.poll(() => input.getAttribute('aria-invalid')).toBe('true');
  expect(document.body.textContent).toContain('Slug is required.');

  await userEvent.fill(input, 'taken');
  await userEvent.tab();
  await expect
    .poll(() => document.querySelector('output')?.dataset['error'])
    .toBe('Slug is already in use.');
  expect(document.querySelector('output')?.textContent).toContain(
    'Slug is already in use.',
  );

  await userEvent.fill(input, 'available');
  (
    page.getByRole('button', { name: 'Validate' }).element() as HTMLButtonElement
  ).click();
  await expect.poll(() => input.getAttribute('aria-invalid')).not.toBe('true');
  expect(states.some((state) => state.dirty && state.filled && state.touched)).toBe(
    true,
  );
});

test('applies sizes, item layout, disabled styling, and public customization tokens', async () => {
  await render(
    <div data-theme="tinyrack-light">
      <TRField.Root uiSize="sm">
        <TRField.Control aria-label="Small rack" />
      </TRField.Root>
      <TRField.Root uiSize="lg">
        <TRField.Control aria-label="Large rack" />
      </TRField.Root>
      <TRField.Root
        invalid
        style={
          {
            '--tr-field-control-background': 'rgb(24, 24, 27)',
            '--tr-field-control-color': 'rgb(250, 250, 250)',
            '--tr-field-error-color': 'rgb(251, 146, 60)',
          } as CSSProperties
        }
      >
        <TRField.Label>Customized</TRField.Label>
        <TRField.Control />
        <TRField.Error match>Custom error</TRField.Error>
        <TRField.Item disabled>Disabled option</TRField.Item>
      </TRField.Root>
    </div>,
  );

  const [small, large, customized] = Array.from(
    document.querySelectorAll<HTMLInputElement>('.tr-field-control'),
  );
  const error = document.querySelector<HTMLElement>('.tr-field-error');
  const item = document.querySelector<HTMLElement>('.tr-field-item');
  expect(small?.getBoundingClientRect().height).toBe(32);
  expect(large?.getBoundingClientRect().height).toBe(48);
  expect(getComputedStyle(customized as HTMLInputElement).backgroundColor).toBe(
    'rgb(24, 24, 27)',
  );
  expect(getComputedStyle(customized as HTMLInputElement).borderColor).toBe(
    'rgb(220, 38, 38)',
  );
  expect(getComputedStyle(customized as HTMLInputElement).color).toBe(
    'rgb(250, 250, 250)',
  );
  expect(getComputedStyle(error as HTMLElement).color).toBe('rgb(251, 146, 60)');
  expect(getComputedStyle(item as HTMLElement).display).toBe('flex');
  expect(getComputedStyle(item as HTMLElement).opacity).not.toBe('1');
});

test('renders and hydrates a populated invalid field without recovery', async () => {
  function HydratedField() {
    return (
      <TRField.Root invalid name="hydrated-email">
        <TRField.Label>Email</TRField.Label>
        <TRField.Control defaultValue="invalid" type="email" />
        <TRField.Description>Work email</TRField.Description>
        <TRField.Error match>Enter a valid email.</TRField.Error>
      </TRField.Root>
    );
  }

  const host = document.createElement('div');
  host.innerHTML = renderToString(<HydratedField />);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, <HydratedField />, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('input')).toHaveValue('invalid');
  expect(host.querySelector('input')).toHaveAccessibleName('Email');
  expect(host.querySelector('input')).toHaveAttribute('aria-invalid', 'true');

  await act(async () => root.unmount());
  host.remove();
});
