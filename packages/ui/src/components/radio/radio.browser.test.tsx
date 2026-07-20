import '../../core/core.css';
import './radio.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
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
