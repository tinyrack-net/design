import './radio-group.css';
import { createRef, useState } from 'react';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import '../radio/radio.css';
import { TRRadio } from '../radio/index.js';
import { TRRadioGroup } from './index.js';

test('renders the Tinyrack TRRadioGroup wrapper', async () => {
  expect(typeof TRRadioGroup).toBe('function');
  await render(
    <TRRadioGroup aria-label="Options" defaultValue="one">
      Options
    </TRRadioGroup>,
  );
  expect(document.querySelector('.tr-radio-group')).not.toBeNull();
});

function ControlledRackGroup() {
  const [value, setValue] = useState('alpha');

  return (
    <form data-testid="rack-form">
      <TRRadioGroup
        aria-label="Deployment rack"
        name="rack"
        onValueChange={(nextValue) => setValue(nextValue as string)}
        value={value}
      >
        <TRRadio.Root id="rack-alpha" value="alpha">
          <TRRadio.Indicator />
        </TRRadio.Root>
        <label htmlFor="rack-alpha">Alpha</label>
        <TRRadio.Root id="rack-beta" value="beta">
          <TRRadio.Indicator />
        </TRRadio.Root>
        <label htmlFor="rack-beta">Beta</label>
      </TRRadioGroup>
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
      <TRRadioGroup aria-label="Read only racks" defaultValue="alpha" readOnly>
        <TRRadio.Root
          aria-label="Read only alpha"
          style={{ height: 24, width: 24 }}
          value="alpha"
        />
        <TRRadio.Root
          aria-label="Read only beta"
          style={{ height: 24, width: 24 }}
          value="beta"
        />
      </TRRadioGroup>
      <TRRadioGroup aria-label="Disabled racks" defaultValue="alpha" disabled>
        <TRRadio.Root
          aria-label="Disabled alpha"
          style={{ height: 24, width: 24 }}
          value="alpha"
        />
        <TRRadio.Root
          aria-label="Disabled beta"
          style={{ height: 24, width: 24 }}
          value="beta"
        />
      </TRRadioGroup>
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

test('preserves render, refs, native props, and external form reset', async () => {
  const rootRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  await render(
    <>
      <form id="external-radio-form" />
      <TRRadioGroup
        aria-label="External racks"
        className={(state) => `consumer-group ${state.required ? 'is-required' : ''}`}
        defaultValue="alpha"
        form="external-radio-form"
        inputRef={inputRef}
        name="rack"
        ref={rootRef}
        render={<section data-consumer="radio-group" />}
        required
        style={{ gap: 'var(--tinyrack-space-sm)' }}
      >
        <TRRadio.Root aria-label="External alpha" value="alpha" />
        <TRRadio.Root aria-label="External beta" value="beta" />
      </TRRadioGroup>
    </>,
  );

  const form = document.querySelector<HTMLFormElement>('#external-radio-form');
  expect(rootRef.current?.tagName).toBe('SECTION');
  expect(rootRef.current?.dataset['consumer']).toBe('radio-group');
  expect(rootRef.current).toHaveClass(
    'tr-radio-group',
    'consumer-group',
    'is-required',
  );
  expect(inputRef.current?.form).toBe(form);
  expect(new FormData(form as HTMLFormElement).get('rack')).toBe('alpha');

  (page.getByRole('radio', { name: 'External beta' }).element() as HTMLElement).click();
  await expect
    .poll(() => new FormData(form as HTMLFormElement).get('rack'))
    .toBe('beta');
  form?.reset();
  await expect
    .poll(() => new FormData(form as HTMLFormElement).get('rack'))
    .toBe('alpha');
});
