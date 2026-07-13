import './toggle.css';
import { useState } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Toggle } from './index.js';

test('renders the Tinyrack Toggle wrapper', async () => {
  expect(typeof Toggle).toBe('function');
  await render(
    <Toggle aria-label="Bold" defaultPressed>
      Bold
    </Toggle>,
  );
  expect(document.querySelector('.tr-toggle')).not.toBeNull();
});

test('preserves controlled pressed state and native button props', async () => {
  function ControlledToggle() {
    const [pressed, setPressed] = useState(false);

    return (
      <>
        <Toggle
          data-testid="toggle"
          onPressedChange={setPressed}
          pressed={pressed}
          type="button"
        >
          Bold
        </Toggle>
        <output>{pressed ? 'on' : 'off'}</output>
      </>
    );
  }

  await render(<ControlledToggle />);
  const toggle = document.querySelector<HTMLButtonElement>('[data-testid="toggle"]');
  expect(toggle?.type).toBe('button');
  expect(toggle?.getAttribute('aria-pressed')).toBe('false');
  toggle?.click();
  await expect.poll(() => document.querySelector('output')?.textContent).toBe('on');
  expect(toggle?.getAttribute('aria-pressed')).toBe('true');
});
