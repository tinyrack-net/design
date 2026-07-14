import '../../core/core.css';
import './checkbox.css';
import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Field } from '../field/index.js';
import { Checkbox, CheckboxRoot } from './index.js';

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
      <Field.Root invalid={attempted && !checked}>
        <Checkbox.Root
          checked={checked}
          id="required-checkbox"
          name="terms"
          onCheckedChange={setChecked}
          required
        >
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
        <label htmlFor="required-checkbox">Accept terms</label>
      </Field.Root>
      <button type="submit">Continue</button>
    </form>
  );
}

test('preserves label, checked, and native form contracts', async () => {
  expect(Checkbox.Root).toBe(CheckboxRoot);
  await render(
    <form>
      <Checkbox.Root id="accept-checkbox" defaultChecked name="accept" value="yes">
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
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
      <Checkbox.Root
        aria-label="Select all"
        checked={checked}
        indeterminate={indeterminate}
        onCheckedChange={(nextChecked) => {
          setChecked(nextChecked);
          setIndeterminate(false);
          onCheckedChange(nextChecked);
        }}
      >
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
    );
  }

  await render(
    <>
      <IndeterminateCheckbox />
      <Checkbox.Root aria-label="Readonly" defaultChecked readOnly />
      <Checkbox.Root aria-label="Disabled" disabled />
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
