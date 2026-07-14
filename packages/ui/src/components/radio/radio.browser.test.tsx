import '../../core/core.css';
import './radio.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { RadioGroup } from '../radio-group/index.js';
import { Radio, RadioRoot } from './index.js';

test('renders a centered, visible indicator inside its radio group', async () => {
  expect(Radio.Root).toBe(RadioRoot);
  await render(
    <RadioGroup data-theme="tinyrack-light" defaultValue="option" name="choice">
      <Radio.Root id="visible-radio" value="option">
        <Radio.Indicator />
      </Radio.Root>
      <label htmlFor="visible-radio">Option</label>
    </RadioGroup>,
  );

  const control = page.getByRole('radio', { name: 'Option' });
  const controlElement = control.element() as HTMLElement;
  const indicator = controlElement.querySelector<HTMLElement>('.tr-radio-indicator');
  const indicatorStyle = getComputedStyle(indicator as HTMLElement);

  expect(controlElement.getAttribute('aria-checked')).toBe('true');
  expect(indicatorStyle.display).toBe('block');
  expect(indicatorStyle.height).toBe('8px');
  expect(indicatorStyle.width).toBe('8px');
  expect(indicatorStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
});

test('forwards root and hidden-input refs with native form identity', async () => {
  const rootRef = createRef<HTMLSpanElement>();
  const inputRef = createRef<HTMLInputElement>();

  await render(
    <RadioGroup defaultValue="beta" name="rack">
      <Radio.Root
        className="consumer-radio"
        data-testid="beta-radio"
        id="beta-radio"
        inputRef={inputRef}
        ref={rootRef}
        value="beta"
      >
        <Radio.Indicator />
      </Radio.Root>
      <label htmlFor="beta-radio">Rack Beta</label>
    </RadioGroup>,
  );

  const control = page.getByRole('radio', { name: 'Rack Beta' }).element();
  expect(rootRef.current).toBe(control);
  expect(rootRef.current?.classList.contains('consumer-radio')).toBe(true);
  expect(inputRef.current?.name).toBe('rack');
  expect(inputRef.current?.value).toBe('beta');
  expect(inputRef.current?.checked).toBe(true);
});
