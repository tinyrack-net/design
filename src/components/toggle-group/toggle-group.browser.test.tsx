import './toggle-group.css';
import { useState } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Toggle } from '../toggle/index.js';
import { ToggleGroup } from './index.js';

test('renders the Tinyrack ToggleGroup wrapper', async () => {
  expect(typeof ToggleGroup).toBe('function');
  await render(
    <ToggleGroup aria-label="Alignment" defaultValue={['start']}>
      Alignment
    </ToggleGroup>,
  );
  expect(document.querySelector('.tr-toggle-group')).not.toBeNull();
});

test('preserves controlled multiple selection and orientation state', async () => {
  function ControlledToggleGroup() {
    const [value, setValue] = useState<string[]>(['bold']);

    return (
      <>
        <ToggleGroup
          aria-label="Formatting"
          multiple
          onValueChange={setValue}
          orientation="vertical"
          value={value}
        >
          <Toggle value="bold">Bold</Toggle>
          <Toggle value="italic">Italic</Toggle>
        </ToggleGroup>
        <output>{value.join(', ')}</output>
      </>
    );
  }

  await render(<ControlledToggleGroup />);
  const group = document.querySelector<HTMLElement>('.tr-toggle-group');
  const italic = [...document.querySelectorAll<HTMLButtonElement>('.tr-toggle')].find(
    (toggle) => toggle.textContent === 'Italic',
  );
  expect(group?.dataset['orientation']).toBe('vertical');
  italic?.click();
  await expect
    .poll(() => document.querySelector('output')?.textContent)
    .toBe('bold, italic');
  expect(italic?.getAttribute('aria-pressed')).toBe('true');
});
