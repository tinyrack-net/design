import '../../core/core.css';
import './checkbox.css';
import { act, type CSSProperties, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRField } from '../field/index.js';
import { TRCheckbox, TRCheckboxRoot } from './index.js';

function RequiredCheckboxHarness() {
  const [attempted, setAttempted] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <form
      data-theme="tinyrack-light"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.currentTarget.checkValidity();
        setAttempted(true);
      }}
    >
      <TRField.Root invalid={attempted && !checked}>
        <TRCheckbox.Root
          checked={checked}
          id="required-checkbox"
          name="terms"
          onCheckedChange={setChecked}
          required
        >
          <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
        </TRCheckbox.Root>
        <label htmlFor="required-checkbox">Accept terms</label>
      </TRField.Root>
      <button type="submit">Continue</button>
    </form>
  );
}

test('preserves label, checked, and native form contracts', async () => {
  expect(TRCheckbox.Root).toBe(TRCheckboxRoot);
  await render(
    <form>
      <TRCheckbox.Root id="accept-checkbox" defaultChecked name="accept" value="yes">
        <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
      </TRCheckbox.Root>
      <label htmlFor="accept-checkbox">Accept</label>
    </form>,
  );

  const control = page.getByRole('checkbox', { name: 'Accept' });
  const input = document.querySelector<HTMLInputElement>('#accept-checkbox');

  expect(control.element().getAttribute('aria-checked')).toBe('true');
  expect(input?.checked).toBe(true);
  expect(input?.name).toBe('accept');
  expect(input?.value).toBe('yes');
});

test('forwards root, input, and indicator refs with consumer props and tokens', async () => {
  const rootRef = createRef<HTMLElement>();
  const inputRef = createRef<HTMLInputElement>();
  const indicatorRef = createRef<HTMLSpanElement>();
  const onClick = vi.fn();

  await render(
    <TRCheckbox.Root
      aria-label="Customized"
      className="consumer-checkbox"
      defaultChecked
      inputRef={inputRef}
      onClick={onClick}
      ref={rootRef}
      style={
        {
          '--tr-checkbox-background': 'rgb(23, 23, 23)',
          '--tr-checkbox-checked-background': 'rgb(37, 99, 235)',
          '--tr-checkbox-indicator-color': 'rgb(250, 250, 250)',
        } as CSSProperties
      }
    >
      <TRCheckbox.Indicator className="consumer-indicator" ref={indicatorRef}>
        ✓
      </TRCheckbox.Indicator>
    </TRCheckbox.Root>,
  );

  const control = page
    .getByRole('checkbox', { name: 'Customized' })
    .element() as HTMLElement;
  expect(rootRef.current).toBe(control);
  expect(rootRef.current).toHaveClass('tr-checkbox', 'consumer-checkbox');
  expect(inputRef.current?.type).toBe('checkbox');
  expect(indicatorRef.current).toHaveClass(
    'tr-checkbox-indicator',
    'consumer-indicator',
  );
  expect(getComputedStyle(rootRef.current as HTMLElement).backgroundColor).toBe(
    'rgb(37, 99, 235)',
  );
  expect(getComputedStyle(indicatorRef.current as HTMLElement).color).toBe(
    'rgb(250, 250, 250)',
  );

  control.click();
  expect(onClick).toHaveBeenCalledOnce();
});

test('forwards a callback root ref through its mount lifecycle', async () => {
  let callbackRoot: HTMLElement | null = null;
  const screen = await render(
    <TRCheckbox.Root
      aria-label="Callback ref"
      ref={(node) => {
        callbackRoot = node;
      }}
    />,
  );

  expect(callbackRoot).toBe(
    page.getByRole('checkbox', { name: 'Callback ref' }).element(),
  );
  await screen.unmount();
  expect(callbackRoot).toBeNull();
});

test('supports compact ui size', async () => {
  await render(<TRCheckbox.Root aria-label="Compact option" uiSize="sm" />);
  const checkbox = document.querySelector<HTMLElement>('.tr-checkbox');
  expect(checkbox?.dataset['uiSize']).toBe('sm');
  expect(getComputedStyle(checkbox as HTMLElement).width).toBe('12px');
});

test('scales the indicator with the checkbox size', async () => {
  await render(
    <>
      <TRCheckbox.Root aria-label="Small" defaultChecked uiSize="sm">
        <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
      </TRCheckbox.Root>
      <TRCheckbox.Root aria-label="Medium" defaultChecked uiSize="md">
        <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
      </TRCheckbox.Root>
      <TRCheckbox.Root aria-label="Large" defaultChecked uiSize="lg">
        <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
      </TRCheckbox.Root>
    </>,
  );

  const indicators = document.querySelectorAll<HTMLElement>('.tr-checkbox-indicator');
  expect(indicators).toHaveLength(3);
  expect(getComputedStyle(indicators.item(0)).fontSize).toBe('10px');
  expect(getComputedStyle(indicators.item(1)).fontSize).toBe('12px');
  expect(getComputedStyle(indicators.item(2)).fontSize).toBe('16px');
});

test('serializes explicit checked and unchecked values to an external form', async () => {
  await render(
    <>
      <form id="external-checkbox-form" />
      <TRCheckbox.Root
        aria-label="Monitoring"
        form="external-checkbox-form"
        name="monitoring"
        uncheckedValue="disabled"
        value="enabled"
      />
    </>,
  );

  const form = document.querySelector<HTMLFormElement>('#external-checkbox-form');
  const currentControl = () => page.getByRole('checkbox', { name: 'Monitoring' });
  expect(new FormData(form as HTMLFormElement).get('monitoring')).toBe('disabled');
  (currentControl().element() as HTMLElement).click();
  await expect
    .poll(() => currentControl().element().getAttribute('aria-checked'))
    .toBe('true');
  expect(new FormData(form as HTMLFormElement).get('monitoring')).toBe('enabled');

  form?.reset();
  await expect
    .poll(() => currentControl().element().getAttribute('aria-checked'))
    .toBe('false');
  expect(new FormData(form as HTMLFormElement).get('monitoring')).toBe('disabled');
});

test('surfaces required invalid state and recovers when checked', async () => {
  await render(<RequiredCheckboxHarness />);

  const control = page.getByRole('checkbox', { name: 'Accept terms' });
  const controlElement = control.element() as HTMLElement;
  const input = document.querySelector<HTMLInputElement>('#required-checkbox');
  expect(input?.validity.valueMissing).toBe(true);
  (page.getByRole('button', { name: 'Continue' }).element() as HTMLElement).click();
  await expect.poll(() => controlElement.hasAttribute('data-invalid')).toBe(true);
  await expect
    .poll(() => getComputedStyle(controlElement).borderColor)
    .toBe('rgb(220, 38, 38)');

  controlElement.click();
  await expect.poll(() => input?.checked).toBe(true);
  expect(input?.checkValidity()).toBe(true);
  await expect.poll(() => controlElement.hasAttribute('data-invalid')).toBe(false);
});

test('transitions indeterminate state and blocks readonly and disabled controls', async () => {
  const onCheckedChange = vi.fn();
  function IndeterminateCheckbox() {
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(true);
    return (
      <TRCheckbox.Root
        aria-label="Select all"
        checked={checked}
        indeterminate={indeterminate}
        onCheckedChange={(nextChecked) => {
          setChecked(nextChecked);
          setIndeterminate(false);
          onCheckedChange(nextChecked);
        }}
      >
        <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
      </TRCheckbox.Root>
    );
  }

  await render(
    <>
      <IndeterminateCheckbox />
      <TRCheckbox.Root aria-label="Readonly" defaultChecked readOnly />
      <TRCheckbox.Root aria-label="Disabled" disabled />
    </>,
  );

  const selectAll = page
    .getByRole('checkbox', { name: 'Select all' })
    .element() as HTMLElement;
  const readOnly = page
    .getByRole('checkbox', { name: 'Readonly' })
    .element() as HTMLElement;
  const disabled = page
    .getByRole('checkbox', { name: 'Disabled' })
    .element() as HTMLElement;
  expect(selectAll.getAttribute('aria-checked')).toBe('mixed');
  selectAll.click();
  await expect.poll(() => selectAll.getAttribute('aria-checked')).toBe('true');
  expect(onCheckedChange.mock.calls.at(-1)?.[0]).toBe(true);

  readOnly.click();
  disabled.click();
  expect(readOnly.getAttribute('aria-checked')).toBe('true');
  expect(disabled.getAttribute('aria-checked')).toBe('false');
});

test('supports keyboard focus while preserving controlled and availability boundaries', async () => {
  const onControlledChange = vi.fn();
  const onReadOnlyChange = vi.fn();
  const onDisabledChange = vi.fn();

  await render(
    <>
      <TRCheckbox.Root
        aria-label="Controlled"
        checked
        onCheckedChange={onControlledChange}
      />
      <TRCheckbox.Root
        aria-label="Read only"
        defaultChecked
        onCheckedChange={onReadOnlyChange}
        readOnly
      />
      <TRCheckbox.Root
        aria-label="Unavailable"
        disabled
        onCheckedChange={onDisabledChange}
      />
    </>,
  );

  const controlled = page.getByRole('checkbox', { name: 'Controlled' }).element();
  controlled.focus();
  expect(document.activeElement).toBe(controlled);
  await userEvent.keyboard(' ');
  expect(controlled.getAttribute('aria-checked')).toBe('true');
  expect(onControlledChange.mock.calls.at(-1)?.[0]).toBe(false);

  const readOnly = page.getByRole('checkbox', { name: 'Read only' }).element();
  expect(readOnly.tabIndex).toBe(0);
  expect(readOnly).toHaveAttribute('data-readonly');
  expect(getComputedStyle(readOnly).cursor).toBe('default');
  readOnly.focus();
  await userEvent.keyboard(' ');
  expect(readOnly.getAttribute('aria-checked')).toBe('true');
  expect(onReadOnlyChange).not.toHaveBeenCalled();

  const disabled = page
    .getByRole('checkbox', { name: 'Unavailable' })
    .element() as HTMLElement;
  expect(disabled.tabIndex).toBe(-1);
  expect(disabled).toHaveAttribute('data-disabled');
  disabled.click();
  expect(onDisabledChange).not.toHaveBeenCalled();
});

test('restores uncontrolled native and visual state on form reset', async () => {
  const onCheckedChange = vi.fn();
  await render(
    <form>
      <TRCheckbox.Root
        aria-label="Resettable"
        defaultChecked
        name="resettable"
        onCheckedChange={onCheckedChange}
        value="yes"
      />
      <button type="reset">Reset</button>
    </form>,
  );

  const currentControl = () =>
    page.getByRole('checkbox', { name: 'Resettable' }).element() as HTMLElement;
  const form = document.querySelector('form') as HTMLFormElement;
  currentControl().click();
  await expect.poll(() => currentControl().getAttribute('aria-checked')).toBe('false');
  expect(new FormData(form).has('resettable')).toBe(false);

  (page.getByRole('button', { name: 'Reset' }).element() as HTMLElement).click();
  await expect.poll(() => currentControl().getAttribute('aria-checked')).toBe('true');
  expect(new FormData(form).get('resettable')).toBe('yes');
});

test('ignores form reset safely when a polymorphic renderer has no host node', async () => {
  function EmptyRender() {
    return null;
  }

  await render(
    <>
      <form id="hostless-checkbox-form" />
      <TRCheckbox.Root
        defaultChecked
        form="hostless-checkbox-form"
        name="hostless"
        render={<EmptyRender />}
        value="yes"
      />
    </>,
  );

  const form = document.querySelector<HTMLFormElement>('#hostless-checkbox-form');
  expect(new FormData(form as HTMLFormElement).get('hostless')).toBe('yes');
  expect(() => form?.reset()).not.toThrow();
  expect(new FormData(form as HTMLFormElement).get('hostless')).toBe('yes');
});

test('ignores reset events that do not come from the owning form', async () => {
  await render(
    <>
      <form id="owner-form" />
      <form id="unrelated-form" />
      <TRCheckbox.Root
        aria-label="Externally owned"
        defaultChecked
        form="owner-form"
        name="external"
        value="yes"
      />
    </>,
  );

  const control = page
    .getByRole('checkbox', { name: 'Externally owned' })
    .element() as HTMLElement;
  const unrelatedForm = document.querySelector<HTMLFormElement>('#unrelated-form');

  unrelatedForm?.reset();
  document.body.dispatchEvent(new Event('reset', { bubbles: true }));

  expect(page.getByRole('checkbox', { name: 'Externally owned' }).element()).toBe(
    control,
  );
  expect(control).toHaveAttribute('aria-checked', 'true');
});

test('renders on the server and hydrates checked and mixed state without recovery', async () => {
  function HydratedCheckboxes() {
    return (
      <>
        <TRCheckbox.Root aria-label="Hydrated checked" defaultChecked>
          <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
        </TRCheckbox.Root>
        <TRCheckbox.Root aria-label="Hydrated mixed" indeterminate>
          <TRCheckbox.Indicator
            render={(props, state) => (
              <span {...props}>{state.indeterminate ? '−' : '✓'}</span>
            )}
          />
        </TRCheckbox.Root>
      </>
    );
  }

  const host = document.createElement('div');
  host.innerHTML = renderToString(<HydratedCheckboxes />);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, <HydratedCheckboxes />, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('[aria-label="Hydrated checked"]')).toHaveAttribute(
    'aria-checked',
    'true',
  );
  expect(host.querySelector('[aria-label="Hydrated mixed"]')).toHaveAttribute(
    'aria-checked',
    'mixed',
  );

  await act(async () => root.unmount());
  host.remove();
});
