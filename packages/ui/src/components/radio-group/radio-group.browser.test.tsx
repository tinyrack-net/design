import './radio-group.css';
import { useState } from 'react';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import '../radio/radio.css';
import { Radio } from '../radio/index.js';
import { RadioGroup } from './index.js';

test('renders the Tinyrack RadioGroup wrapper', async () => {
  expect(typeof RadioGroup).toBe('function');
  await render(
    <RadioGroup aria-label="Options" defaultValue="one">
      Options
    </RadioGroup>,
  );
  expect(document.querySelector('.tr-radio-group')).not.toBeNull();
});

function ControlledRackGroup() {
  const [value, setValue] = useState('alpha');

  return (
    <form data-testid="rack-form">
      <RadioGroup
        aria-label="Deployment rack"
        name="rack"
        onValueChange={(nextValue) => setValue(nextValue as string)}
        value={value}
      >
        <Radio.Root id="rack-alpha" value="alpha">
          <Radio.Indicator />
        </Radio.Root>
        <label htmlFor="rack-alpha">Alpha</label>
        <Radio.Root id="rack-beta" value="beta">
          <Radio.Indicator />
        </Radio.Root>
        <label htmlFor="rack-beta">Beta</label>
      </RadioGroup>
      <output>{value}</output>
    </form>
  );
}

test('synchronizes controlled keyboard selection and native form value', async () => {
  await render(<ControlledRackGroup />);

  const alpha = page.getByRole('radio', { name: 'Alpha' });
  const beta = page.getByRole('radio', { name: 'Beta' });
  alpha.element().focus();
  await userEvent.keyboard('{ArrowRight}');

  await expect.poll(() => beta.element().getAttribute('aria-checked')).toBe('true');
  await expect.poll(() => document.querySelector('output')?.textContent).toBe('beta');
  const form = document.querySelector<HTMLFormElement>('[data-testid="rack-form"]');
  expect(new FormData(form as HTMLFormElement).get('rack')).toBe('beta');
});

test('keeps read-only and disabled groups from mutating', async () => {
  await render(
    <div>
      <RadioGroup aria-label="Read only racks" defaultValue="alpha" readOnly>
        <Radio.Root
          aria-label="Read only alpha"
          style={{ height: 24, width: 24 }}
          value="alpha"
        />
        <Radio.Root
          aria-label="Read only beta"
          style={{ height: 24, width: 24 }}
          value="beta"
        />
      </RadioGroup>
      <RadioGroup aria-label="Disabled racks" defaultValue="alpha" disabled>
        <Radio.Root
          aria-label="Disabled alpha"
          style={{ height: 24, width: 24 }}
          value="alpha"
        />
        <Radio.Root
          aria-label="Disabled beta"
          style={{ height: 24, width: 24 }}
          value="beta"
        />
      </RadioGroup>
    </div>,
  );

  const readOnlyBeta = page.getByRole('radio', { name: 'Read only beta' });
  await readOnlyBeta.click();
  expect(readOnlyBeta.element().getAttribute('aria-checked')).toBe('false');

  const disabledBeta = page.getByRole('radio', { name: 'Disabled beta' });
  expect(disabledBeta.element().getAttribute('aria-disabled')).toBe('true');
  await disabledBeta.click({ force: true });
  expect(disabledBeta.element().getAttribute('aria-checked')).toBe('false');
});
