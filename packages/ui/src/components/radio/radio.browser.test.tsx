import '../../core/core.css';
import './radio.css';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRField } from '../field/index.js';
import { TRRadioGroup } from '../radio-group/index.js';
import { TRRadio, TRRadioRoot } from './index.js';

test('renders a centered, visible indicator inside its radio group', async () => {
  expect(TRRadio.Root).toBe(TRRadioRoot);
  await render(
    <TRRadioGroup data-theme="tinyrack-light" defaultValue="option" name="choice">
      <TRRadio.Root id="visible-radio" value="option">
        <TRRadio.Indicator />
      </TRRadio.Root>
      <label htmlFor="visible-radio">Option</label>
    </TRRadioGroup>,
  );

  const control = page.getByRole('radio', { name: 'Option' });
  const controlElement = control.element() as HTMLElement;
  const indicator = controlElement.querySelector<HTMLElement>('.tr-radio-indicator');
  const indicatorStyle = getComputedStyle(indicator as HTMLElement);
  const controlRect = controlElement.getBoundingClientRect();
  const indicatorRect = (indicator as HTMLElement).getBoundingClientRect();

  expect(controlElement.getAttribute('aria-checked')).toBe('true');
  expect(indicatorStyle.display).toBe('block');
  expect(indicatorStyle.height).toBe('8px');
  expect(indicatorStyle.width).toBe('8px');
  expect(indicatorStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(indicatorRect.x + indicatorRect.width / 2).toBeCloseTo(
    controlRect.x + controlRect.width / 2,
  );
  expect(indicatorRect.y + indicatorRect.height / 2).toBeCloseTo(
    controlRect.y + controlRect.height / 2,
  );
});

test('supports compact ui size', async () => {
  await render(
    <TRRadioGroup defaultValue="compact" name="compact-choice">
      <TRRadio.Root uiSize="sm" value="compact" />
    </TRRadioGroup>,
  );
  const radio = document.querySelector<HTMLElement>('.tr-radio');
  expect(radio?.dataset['uiSize']).toBe('sm');
  expect(getComputedStyle(radio as HTMLElement).width).toBe('12px');
});

test('scales the indicator with the radio size', async () => {
  await render(
    <>
      <TRRadioGroup defaultValue="small" name="small-choice">
        <TRRadio.Root uiSize="sm" value="small">
          <TRRadio.Indicator />
        </TRRadio.Root>
      </TRRadioGroup>
      <TRRadioGroup defaultValue="medium" name="medium-choice">
        <TRRadio.Root uiSize="md" value="medium">
          <TRRadio.Indicator />
        </TRRadio.Root>
      </TRRadioGroup>
      <TRRadioGroup defaultValue="large" name="large-choice">
        <TRRadio.Root uiSize="lg" value="large">
          <TRRadio.Indicator />
        </TRRadio.Root>
      </TRRadioGroup>
    </>,
  );

  const indicators = document.querySelectorAll<HTMLElement>('.tr-radio-indicator');
  expect(indicators).toHaveLength(3);
  expect(getComputedStyle(indicators.item(0)).width).toBe('4px');
  expect(getComputedStyle(indicators.item(1)).width).toBe('8px');
  expect(getComputedStyle(indicators.item(2)).width).toBe('12px');
});

test('forwards root and hidden-input refs with native form identity', async () => {
  const rootRef = createRef<HTMLSpanElement>();
  const inputRef = createRef<HTMLInputElement>();

  await render(
    <TRRadioGroup defaultValue="beta" name="rack">
      <TRRadio.Root
        className="consumer-radio"
        data-testid="beta-radio"
        id="beta-radio"
        inputRef={inputRef}
        ref={rootRef}
        value="beta"
      >
        <TRRadio.Indicator />
      </TRRadio.Root>
      <label htmlFor="beta-radio">Rack Beta</label>
    </TRRadioGroup>,
  );

  const control = page.getByRole('radio', { name: 'Rack Beta' }).element();
  expect(rootRef.current).toBe(control);
  expect(rootRef.current?.classList.contains('consumer-radio')).toBe(true);
  expect(inputRef.current?.name).toBe('rack');
  expect(inputRef.current?.value).toBe('beta');
  expect(inputRef.current?.checked).toBe(true);
});

function ControlledRadioHarness() {
  const [value, setValue] = useState('alpha');

  return (
    <TRRadioGroup
      aria-label="Rack"
      name="rack"
      onValueChange={(nextValue) => setValue(String(nextValue))}
      value={value}
    >
      <TRRadio.Root aria-label="Alpha" value="alpha">
        <TRRadio.Indicator />
      </TRRadio.Root>
      <TRRadio.Root aria-label="Beta" value="beta">
        <TRRadio.Indicator />
      </TRRadio.Root>
    </TRRadioGroup>
  );
}

test('updates controlled selection by pointer and keyboard while mounting one indicator', async () => {
  await render(<ControlledRadioHarness />);
  const alpha = page.getByRole('radio', { name: 'Alpha' });
  const beta = page.getByRole('radio', { name: 'Beta' });

  expect(document.querySelectorAll('.tr-radio-indicator')).toHaveLength(1);
  await beta.click();
  await expect.poll(() => beta.element().getAttribute('aria-checked')).toBe('true');
  expect(document.querySelectorAll('.tr-radio-indicator')).toHaveLength(1);

  beta.element().focus();
  await userEvent.keyboard('{ArrowLeft}');
  await expect.poll(() => alpha.element().getAttribute('aria-checked')).toBe('true');
  expect(document.activeElement).toBe(alpha.element());
});

test('preserves render, functional styles, root events, and indicator refs', async () => {
  const onClick = vi.fn();
  const indicatorRef = createRef<HTMLSpanElement>();

  await render(
    <TRRadioGroup defaultValue="custom" name="custom-radio">
      <TRRadio.Root
        aria-label="Custom"
        className={(state) => (state.checked ? 'consumer-checked' : undefined)}
        nativeButton
        onClick={onClick}
        render={<button data-consumer="radio" type="button" />}
        style={(state) => ({ opacity: state.checked ? 0.75 : 1 })}
        value="custom"
      >
        <TRRadio.Indicator ref={indicatorRef} />
      </TRRadio.Root>
    </TRRadioGroup>,
  );

  const radio = page.getByRole('radio', { name: 'Custom' });
  expect(radio.element().tagName).toBe('BUTTON');
  expect(radio.element()).toHaveClass('tr-radio', 'consumer-checked');
  expect((radio.element() as HTMLElement).style.opacity).toBe('0.75');
  expect(indicatorRef.current).toHaveClass('tr-radio-indicator');
  await radio.click();
  expect(onClick).toHaveBeenCalledOnce();
});

test('styles invalid state with its semantic danger token', async () => {
  await render(
    <div data-theme="tinyrack-light">
      <TRField.Root invalid>
        <TRRadioGroup aria-label="Invalid style">
          <TRRadio.Root aria-label="Invalid" value="invalid" />
        </TRRadioGroup>
      </TRField.Root>
    </div>,
  );

  const invalid = page.getByRole('radio', { name: 'Invalid' }).element() as HTMLElement;
  expect(invalid).toHaveAttribute('data-invalid');
  await expect
    .poll(() => getComputedStyle(invalid).borderColor)
    .toBe('rgb(220, 38, 38)');
});

test('uses a non-interactive cursor for item-level read-only state', async () => {
  await render(
    <TRRadioGroup aria-label="Read-only style">
      <TRRadio.Root aria-label="Read only" readOnly value="readonly" />
    </TRRadioGroup>,
  );

  const readOnly = page
    .getByRole('radio', { name: 'Read only' })
    .element() as HTMLElement;
  expect(readOnly).toHaveAttribute('data-readonly');
  expect(getComputedStyle(readOnly).cursor).toBe('default');
});

test('uses semantic hover tokens for available unchecked and checked states', async () => {
  await render(
    <div data-theme="tinyrack-dark">
      <TRRadioGroup aria-label="Hover styles" defaultValue="checked">
        <TRRadio.Root aria-label="Unchecked" value="unchecked" />
        <TRRadio.Root aria-label="Checked" value="checked">
          <TRRadio.Indicator />
        </TRRadio.Root>
      </TRRadioGroup>
    </div>,
  );

  const unchecked = page.getByRole('radio', { name: 'Unchecked' });
  await unchecked.hover();
  await expect
    .poll(() => getComputedStyle(unchecked.element() as HTMLElement).backgroundColor)
    .toBe('rgb(38, 38, 38)');

  const checked = page.getByRole('radio', { name: 'Checked', exact: true });
  await checked.hover();
  await expect
    .poll(() => getComputedStyle(checked.element() as HTMLElement).borderColor)
    .toBe('rgb(229, 229, 229)');
});
