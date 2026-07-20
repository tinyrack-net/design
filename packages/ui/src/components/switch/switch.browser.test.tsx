import '../../core/core.css';
import './switch.css';
import { type CSSProperties, createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRField } from '../field/index.js';
import { TRSwitch, TRSwitchRoot } from './index.js';

function RequiredSwitchHarness() {
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
        <TRSwitch.Root
          checked={checked}
          id="required-switch"
          name="acknowledged"
          onCheckedChange={setChecked}
          required
        >
          <TRSwitch.Thumb />
        </TRSwitch.Root>
        <label htmlFor="required-switch">Acknowledge</label>
      </TRField.Root>
      <button type="submit">Continue</button>
    </form>
  );
}

test('preserves root, ref, form, and computed-style contracts', async () => {
  expect(TRSwitch.Root).toBe(TRSwitchRoot);
  const ref = createRef<HTMLSpanElement>();

  await render(
    <form data-theme="tinyrack-dark">
      <TRSwitch.Root
        ref={ref}
        defaultChecked={false}
        id="power-switch"
        name="power"
        style={
          {
            '--tr-switch-background': 'rgb(23, 23, 23)',
            '--tr-switch-hover-background': 'rgb(23, 23, 23)',
          } as CSSProperties
        }
        value="enabled"
      >
        <TRSwitch.Thumb />
      </TRSwitch.Root>
      <label htmlFor="power-switch">Power</label>
    </form>,
  );

  const control = page.getByRole('switch', { name: 'Power' });
  const controlElement = control.element() as HTMLSpanElement;
  const input = document.querySelector<HTMLInputElement>('#power-switch');
  const label = document.querySelector<HTMLLabelElement>('label[for="power-switch"]');

  expect(controlElement).toBe(ref.current);
  expect(controlElement.classList.contains('tr-switch')).toBe(true);
  expect(controlElement.getAttribute('aria-checked')).toBe('false');
  expect(input?.checked).toBe(false);
  expect(input?.name).toBe('power');
  expect(input?.value).toBe('enabled');
  expect(label).not.toBeNull();
  expect(getComputedStyle(controlElement).width).toBe('40px');
  expect(getComputedStyle(controlElement).height).toBe('24px');
  expect(getComputedStyle(controlElement).backgroundColor).toBe('rgb(23, 23, 23)');
  expect(
    getComputedStyle(
      controlElement.querySelector<HTMLElement>('.tr-switch-thumb') as HTMLElement,
    ).backgroundColor,
  ).toBe('rgb(250, 250, 250)');
});

test('toggles from pointer and associated label input', async () => {
  const onCheckedChange = vi.fn();

  await render(
    <form>
      <TRSwitch.Root
        defaultChecked={false}
        id="pointer-switch"
        onCheckedChange={onCheckedChange}
      >
        <TRSwitch.Thumb />
      </TRSwitch.Root>
      <label htmlFor="pointer-switch">Pointer</label>
    </form>,
  );

  const control = page.getByRole('switch', { name: 'Pointer' });
  const controlElement = control.element() as HTMLSpanElement;
  const input = document.querySelector<HTMLInputElement>('#pointer-switch');
  const label = document.querySelector<HTMLLabelElement>('label[for="pointer-switch"]');

  controlElement.click();
  await expect.poll(() => controlElement.getAttribute('aria-checked')).toBe('true');
  expect(input?.checked).toBe(true);
  expect(onCheckedChange.mock.calls.at(-1)?.[0]).toBe(true);

  label?.click();
  await expect.poll(() => controlElement.getAttribute('aria-checked')).toBe('false');
  expect(input?.checked).toBe(false);
  expect(onCheckedChange.mock.calls.at(-1)?.[0]).toBe(false);
});

test('toggles from keyboard input and moves the thumb', async () => {
  await render(
    <TRSwitch.Root aria-label="Keyboard" defaultChecked={false}>
      <TRSwitch.Thumb />
    </TRSwitch.Root>,
  );

  const control = page.getByRole('switch', { name: 'Keyboard' });
  const controlElement = control.element() as HTMLSpanElement;
  const thumb = controlElement.querySelector<HTMLElement>('.tr-switch-thumb');

  controlElement.focus();
  await userEvent.keyboard(' ');
  await expect.poll(() => controlElement.getAttribute('aria-checked')).toBe('true');
  await expect
    .poll(() => getComputedStyle(thumb as HTMLElement).transform)
    .not.toBe('none');
});

test('preserves controlled and disabled state boundaries', async () => {
  const onControlledChange = vi.fn();
  const onDisabledChange = vi.fn();

  await render(
    <div data-theme="tinyrack-dark">
      <TRSwitch.Root
        aria-label="Controlled"
        checked
        onCheckedChange={onControlledChange}
      >
        <TRSwitch.Thumb />
      </TRSwitch.Root>
      <TRSwitch.Root
        aria-label="Unavailable"
        defaultChecked
        disabled
        id="unavailable-switch"
        onCheckedChange={onDisabledChange}
      >
        <TRSwitch.Thumb />
      </TRSwitch.Root>
    </div>,
  );

  const controlled = page.getByRole('switch', { name: 'Controlled' });
  const controlledElement = controlled.element() as HTMLSpanElement;
  controlledElement.click();
  expect(controlledElement.getAttribute('aria-checked')).toBe('true');
  expect(onControlledChange.mock.calls.at(-1)?.[0]).toBe(false);

  const disabled = page.getByRole('switch', { name: 'Unavailable' });
  const disabledElement = disabled.element() as HTMLSpanElement;
  const disabledInput = document.querySelector<HTMLInputElement>('#unavailable-switch');
  disabledElement.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true }),
  );

  expect(disabledElement.getAttribute('aria-checked')).toBe('true');
  expect(disabledElement.tabIndex).toBe(-1);
  expect(disabledInput?.disabled).toBe(true);
  expect(onDisabledChange).not.toHaveBeenCalled();
  expect(getComputedStyle(disabledElement).opacity).toBe('1');
  expect(
    getComputedStyle(
      disabledElement.querySelector<HTMLElement>('.tr-switch-thumb') as HTMLElement,
    ).opacity,
  ).toBe('1');
  expect(getComputedStyle(disabledElement).backgroundColor).not.toBe(
    getComputedStyle(document.documentElement).backgroundColor,
  );
});

test('surfaces required invalid state and recovers when switched on', async () => {
  await render(<RequiredSwitchHarness />);

  const control = page.getByRole('switch', { name: 'Acknowledge' });
  const controlElement = control.element() as HTMLElement;
  const input = document.querySelector<HTMLInputElement>('#required-switch');

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

test('keeps read-only switches focusable without mutating native form state', async () => {
  const onCheckedChange = vi.fn();

  await render(
    <form data-testid="readonly-switch-form">
      <TRSwitch.Root
        defaultChecked
        id="readonly-switch"
        name="monitoring"
        onCheckedChange={onCheckedChange}
        readOnly
        value="enabled"
      >
        <TRSwitch.Thumb />
      </TRSwitch.Root>
      <label htmlFor="readonly-switch">Monitoring</label>
    </form>,
  );

  const control = page.getByRole('switch', { name: 'Monitoring' });
  const controlElement = control.element() as HTMLElement;
  expect(controlElement.tabIndex).toBe(0);
  expect(controlElement.getAttribute('aria-checked')).toBe('true');
  expect(controlElement.hasAttribute('data-readonly')).toBe(true);
  expect(getComputedStyle(controlElement).cursor).toBe('default');

  await control.click();
  controlElement.focus();
  await userEvent.keyboard(' ');
  expect(controlElement.getAttribute('aria-checked')).toBe('true');
  expect(onCheckedChange).not.toHaveBeenCalled();

  const form = document.querySelector<HTMLFormElement>(
    '[data-testid="readonly-switch-form"]',
  );
  expect(new FormData(form as HTMLFormElement).get('monitoring')).toBe('enabled');
});
