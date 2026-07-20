import '../../core/core.css';
import './checkbox.css';
import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
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
  const control = page.getByRole('checkbox', { name: 'Monitoring' });
  expect(new FormData(form as HTMLFormElement).get('monitoring')).toBe('disabled');
  (control.element() as HTMLElement).click();
  await expect.poll(() => control.element().getAttribute('aria-checked')).toBe('true');
  expect(new FormData(form as HTMLFormElement).get('monitoring')).toBe('enabled');
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
