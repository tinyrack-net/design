import '../../core/core.css';
import './input.css';
import { act, type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRInput } from './index.js';

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

test('renders the Tinyrack TRInput wrapper', async () => {
  expect(typeof TRInput).toBe('function');
  await render(<TRInput aria-label="Name" defaultValue="Tinyrack" />);
  expect(document.querySelector('.tr-input')).not.toBeNull();
});

test('uses control tokens for every ui size', async () => {
  await render(
    <>
      <TRInput aria-label="Small name" uiSize="sm" />
      <TRInput aria-label="Medium name" />
      <TRInput aria-label="Large name" uiSize="lg" />
    </>,
  );

  const small = page.getByRole('textbox', { name: 'Small name' }).element();
  const medium = page.getByRole('textbox', { name: 'Medium name' }).element();
  const large = page.getByRole('textbox', { name: 'Large name' }).element();

  expect(small.dataset['uiSize']).toBe('sm');
  expect(medium.dataset['uiSize']).toBe('md');
  expect(large.dataset['uiSize']).toBe('lg');
  expect(getComputedStyle(small).minHeight).toBe('32px');
  expect(getComputedStyle(medium).minHeight).toBe('40px');
  expect(getComputedStyle(large).minHeight).toBe('48px');
  expect(getComputedStyle(small).fontSize).toBe('14px');
  expect(getComputedStyle(medium).fontSize).toBe('14px');
  expect(getComputedStyle(large).fontSize).toBe('16px');
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

test('preserves required, invalid, disabled, readonly, focus, and consumer styles', async () => {
  await render(
    <div data-theme="tinyrack-light">
      <form>
        <TRInput aria-label="Required rack" name="rack" required />
        <TRInput aria-invalid="true" aria-label="Invalid rack" />
        <TRInput aria-label="Readonly rack" defaultValue="Locked" readOnly />
        <TRInput aria-label="Disabled rack" disabled />
        <TRInput
          aria-label="Custom rack"
          style={
            {
              '--tr-input-background': 'rgb(1, 2, 3)',
            } as CSSProperties
          }
        />
      </form>
    </div>,
  );

  const required = page
    .getByRole('textbox', { name: 'Required rack' })
    .element() as HTMLInputElement;
  const invalid = page
    .getByRole('textbox', { name: 'Invalid rack' })
    .element() as HTMLInputElement;
  const readonly = page
    .getByRole('textbox', { name: 'Readonly rack' })
    .element() as HTMLInputElement;
  const disabled = page
    .getByRole('textbox', { name: 'Disabled rack' })
    .element() as HTMLInputElement;
  const custom = page
    .getByRole('textbox', { name: 'Custom rack' })
    .element() as HTMLInputElement;

  expect(required.required).toBe(true);
  expect(required.checkValidity()).toBe(false);
  expect(getComputedStyle(required).borderColor).toBe('rgb(220, 38, 38)');
  expect(getComputedStyle(invalid).borderColor).toBe('rgb(220, 38, 38)');
  expect(getComputedStyle(custom).backgroundColor).toBe('rgb(1, 2, 3)');

  await userEvent.tab();
  expect(document.activeElement).toBe(required);
  expect(getComputedStyle(required).outlineWidth).toBe('2px');
  readonly.focus();
  await userEvent.keyboard(' change');
  expect(readonly.value).toBe('Locked');
  disabled.focus();
  expect(document.activeElement).not.toBe(disabled);
  expect(getComputedStyle(disabled).cursor).toBe('not-allowed');
  expect(getComputedStyle(disabled).opacity).toBe('0.5');
});

test('renders and hydrates a native input without changing its form contract', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const fixture = (
    <form>
      <label htmlFor="hydrated-rack">Rack name</label>
      <TRInput
        autoComplete="organization"
        defaultValue="rack-alpha"
        id="hydrated-rack"
        name="rack"
        required
      />
    </form>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  const input = host.querySelector<HTMLInputElement>('#hydrated-rack');
  expect(hydrationErrors).toEqual([]);
  expect(input?.tagName).toBe('INPUT');
  expect(input?.getAttribute('autocomplete')).toBe('organization');
  expect(new FormData(input?.form as HTMLFormElement).get('rack')).toBe('rack-alpha');

  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});
