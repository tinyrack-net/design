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
      <TRInput aria-label="Medium name" />
      <TRInput aria-label="Large name" uiSize="lg" />
    </>,
  );

  const medium = page.getByRole('textbox', { name: 'Medium name' }).element();
  const large = page.getByRole('textbox', { name: 'Large name' }).element();

  expect(medium.dataset['uiSize']).toBe('md');
  expect(large.dataset['uiSize']).toBe('lg');
  expect(getComputedStyle(medium).minHeight).toBe('32px');
  expect(getComputedStyle(large).minHeight).toBe('40px');
  expect(getComputedStyle(medium).fontSize).toBe('14px');
  expect(getComputedStyle(large).fontSize).toBe('14px');
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
  await expect
    .poll(() => getComputedStyle(required).borderColor)
    .toBe('rgb(220, 38, 38)');
  await expect
    .poll(() => getComputedStyle(invalid).borderColor)
    .toBe('rgb(220, 38, 38)');
  expect(getComputedStyle(custom).backgroundColor).toBe('rgb(1, 2, 3)');

  await userEvent.tab();
  expect(document.activeElement).toBe(required);
  const requiredFocus = getComputedStyle(required);
  expect(requiredFocus.outlineWidth).toBe('2px');
  expect(requiredFocus.outlineOffset).toBe('-2px');
  expect(requiredFocus.outlineColor).toBe('rgb(220, 38, 38)');
  invalid.focus();
  expect(getComputedStyle(invalid).outlineColor).toBe('rgb(220, 38, 38)');
  readonly.focus();
  await userEvent.keyboard(' change');
  expect(readonly.value).toBe('Locked');
  disabled.focus();
  expect(document.activeElement).not.toBe(disabled);
  expect(getComputedStyle(disabled).cursor).toBe('not-allowed');
  expect(getComputedStyle(disabled).opacity).toBe('0.5');
});

test('uses the Rack Blue inset focus without changing control geometry in both themes', async () => {
  await render(
    <>
      <div data-theme="tinyrack-light">
        <TRInput aria-label="Light rack" />
      </div>
      <div data-theme="tinyrack-dark">
        <TRInput aria-label="Dark rack" />
      </div>
    </>,
  );

  const cases = [
    ['Light rack', 'rgb(37, 99, 235)'],
    ['Dark rack', 'rgb(96, 165, 250)'],
  ] as const;

  for (const [name, color] of cases) {
    const input = page.getByRole('textbox', { name }).element() as HTMLInputElement;
    const before = input.getBoundingClientRect();
    input.focus();
    const after = input.getBoundingClientRect();
    const focusStyle = getComputedStyle(input);
    expect(focusStyle.outlineWidth).toBe('2px');
    expect(focusStyle.outlineOffset).toBe('-2px');
    expect(focusStyle.outlineColor).toBe(color);
    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
  }
});

test('frames a group so the input takes the group height and goes flat', async () => {
  await render(
    <div data-theme="tinyrack-light">
      <TRInput.Group uiSize="md">
        <TRInput.Adornment aria-hidden>@</TRInput.Adornment>
        <TRInput aria-label="Grouped rack" />
        <TRInput.Action aria-label="Clear rack">x</TRInput.Action>
      </TRInput.Group>
      <TRInput aria-label="Standalone rack" />
    </div>,
  );

  const group = document.querySelector('.tr-input-group') as HTMLElement;
  const grouped = page
    .getByRole('textbox', { name: 'Grouped rack' })
    .element() as HTMLInputElement;
  const standalone = page
    .getByRole('textbox', { name: 'Standalone rack' })
    .element() as HTMLInputElement;

  // The input joins the group without the caller naming an internal class.
  expect(grouped).toHaveClass('tr-input-group-input');
  expect(standalone).not.toHaveClass('tr-input-group-input');

  // The frame belongs to the group; the input inside it is borderless.
  expect(group.dataset['uiSize']).toBe('md');
  expect(getComputedStyle(group).borderBottomWidth).toBe('1px');
  expect(getComputedStyle(grouped).borderBottomWidth).toBe('0px');
  expect(getComputedStyle(standalone).borderBottomWidth).toBe('1px');

  // Focusing the input rings the whole group, not just the input.
  grouped.focus();
  expect(getComputedStyle(group).outlineWidth).toBe('2px');
  expect(getComputedStyle(group).outlineOffset).toBe('-2px');

  standalone.focus();
  const standaloneFocus = getComputedStyle(standalone);
  expect(standaloneFocus.outlineOffset).toBe('-2px');
  expect(standaloneFocus.outlineColor).toBe('rgb(37, 99, 235)');

  expect(
    document.querySelector('.tr-input-group-adornment')?.getAttribute('data-side'),
  ).toBe('start');

  // The action is a real, reachable button that cannot submit a form.
  const action = page
    .getByRole('button', { name: 'Clear rack' })
    .element() as HTMLButtonElement;
  expect(action.type).toBe('button');
  action.focus();
  expect(document.activeElement).toBe(action);
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

test('a ghost input drops only its resting chrome', async () => {
  await render(
    <div data-theme="tinyrack-light">
      <TRInput aria-label="Solid rack" />
      <TRInput appearance="ghost" aria-label="Ghost rack" />
      <TRInput appearance="ghost" aria-invalid="true" aria-label="Ghost invalid" />
    </div>,
  );
  const solid = page.getByRole('textbox', { name: 'Solid rack' }).element();
  const ghost = page.getByRole('textbox', { name: 'Ghost rack' }).element();
  const invalid = page.getByRole('textbox', { name: 'Ghost invalid' }).element();

  const solidStyle = getComputedStyle(solid);
  const ghostStyle = getComputedStyle(ghost);
  expect(solidStyle.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(ghostStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(ghostStyle.borderTopColor).toBe('rgba(0, 0, 0, 0)');

  // The border box is kept, so swapping appearance never moves the field.
  expect(ghostStyle.borderTopWidth).toBe(solidStyle.borderTopWidth);
  expect(ghostStyle.minHeight).toBe(solidStyle.minHeight);

  // Invalid still reads through a ghost frame.
  await expect
    .poll(() => getComputedStyle(invalid).borderTopColor)
    .toBe('rgb(220, 38, 38)');

  // Focus emphasis stays the field's own job, not the host surface's. The
  // background is polled because it transitions in.
  await userEvent.tab();
  expect(document.activeElement).toBe(solid);
  await userEvent.tab();
  expect(document.activeElement).toBe(ghost);
  expect(getComputedStyle(ghost).outlineColor).toBe('rgb(37, 99, 235)');
  await expect
    .poll(() => getComputedStyle(ghost).backgroundColor)
    .toBe('rgb(255, 255, 255)');
});
