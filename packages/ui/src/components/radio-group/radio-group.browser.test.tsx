import './radio-group.css';
import { act, type CSSProperties, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
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

test('preserves uncontrolled value changes and cancellable native event details', async () => {
  const onValueChange = vi.fn();
  await render(
    <TRRadioGroup
      aria-label="Uncontrolled racks"
      defaultValue="alpha"
      name="rack"
      onValueChange={(value, details) => {
        onValueChange(value, details.event);
        if (value === 'gamma') details.cancel();
      }}
    >
      <TRRadio.Root
        aria-label="Alpha rack"
        style={{ height: 24, width: 24 }}
        value="alpha"
      />
      <TRRadio.Root
        aria-label="Beta rack"
        style={{ height: 24, width: 24 }}
        value="beta"
      />
      <TRRadio.Root
        aria-label="Gamma rack"
        style={{ height: 24, width: 24 }}
        value="gamma"
      />
    </TRRadioGroup>,
  );

  const beta = page.getByRole('radio', { name: 'Beta rack' });
  const gamma = page.getByRole('radio', { name: 'Gamma rack' });
  await beta.click();
  await expect.poll(() => beta.element().getAttribute('aria-checked')).toBe('true');
  expect(onValueChange).toHaveBeenLastCalledWith('beta', expect.any(PointerEvent));

  await gamma.click();
  expect(gamma.element()).toHaveAttribute('aria-checked', 'false');
  expect(beta.element()).toHaveAttribute('aria-checked', 'true');
  expect(onValueChange).toHaveBeenLastCalledWith('gamma', expect.any(PointerEvent));
});

test('provides one roving tab stop and navigates both axes while skipping disabled radios', async () => {
  await render(
    <TRRadioGroup aria-labelledby="rack-heading" defaultValue="alpha">
      <span id="rack-heading">Deployment rack</span>
      <TRRadio.Root aria-label="Alpha" value="alpha" />
      <TRRadio.Root aria-label="Beta unavailable" disabled value="beta" />
      <TRRadio.Root aria-label="Gamma" value="gamma" />
    </TRRadioGroup>,
  );

  const group = page.getByRole('radiogroup', { name: 'Deployment rack' });
  const alpha = page.getByRole('radio', { name: 'Alpha' });
  const beta = page.getByRole('radio', { name: 'Beta unavailable' });
  const gamma = page.getByRole('radio', { name: 'Gamma' });
  expect(group.element()).toHaveAttribute('aria-labelledby', 'rack-heading');
  expect(alpha.element().tabIndex).toBe(0);
  expect(beta.element().tabIndex).toBe(-1);
  expect(gamma.element().tabIndex).toBe(-1);

  alpha.element().focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(gamma.element());
  expect(gamma.element()).toHaveAttribute('aria-checked', 'true');
  await userEvent.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(alpha.element());
  await userEvent.keyboard('{ArrowLeft}');
  expect(document.activeElement).toBe(gamma.element());
  await userEvent.keyboard('{ArrowUp}');
  expect(document.activeElement).toBe(alpha.element());
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

test('preserves required validity and suppresses disabled form values', async () => {
  const inputRef = createRef<HTMLInputElement>();
  await render(
    <form>
      <TRRadioGroup
        aria-label="Required rack"
        inputRef={inputRef}
        name="required-rack"
        required
      >
        <TRRadio.Root
          aria-label="Required alpha"
          style={{ height: 24, width: 24 }}
          value="alpha"
        />
        <TRRadio.Root
          aria-label="Required beta"
          style={{ height: 24, width: 24 }}
          value="beta"
        />
      </TRRadioGroup>
      <TRRadioGroup
        aria-label="Disabled rack"
        defaultValue="offline"
        disabled
        name="disabled-rack"
      >
        <TRRadio.Root aria-label="Offline" value="offline" />
      </TRRadioGroup>
    </form>,
  );

  const form = document.querySelector('form') as HTMLFormElement;
  expect(inputRef.current?.validity.valueMissing).toBe(true);
  expect(form.checkValidity()).toBe(false);
  await page.getByRole('radio', { name: 'Required beta' }).click();
  await expect.poll(() => inputRef.current?.validity.valid).toBe(true);
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).get('required-rack')).toBe('beta');
  expect(new FormData(form).has('disabled-rack')).toBe(false);
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

test('applies group tokens and state-driven styles without overriding consumers', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(
    <TRRadioGroup
      aria-label="Styled racks"
      className={(state) => (state.readOnly ? 'consumer-readonly' : undefined)}
      readOnly
      ref={ref}
      style={
        {
          '--tr-radio-group-color': 'rgb(12, 34, 56)',
          '--tr-radio-group-gap': '13px',
        } as CSSProperties
      }
    >
      <TRRadio.Root aria-label="Styled alpha" value="alpha" />
    </TRRadioGroup>,
  );

  expect(ref.current).toHaveClass('tr-radio-group', 'consumer-readonly');
  expect(ref.current).toHaveAttribute('data-readonly');
  expect(getComputedStyle(ref.current as HTMLDivElement).color).toBe('rgb(12, 34, 56)');
  expect(getComputedStyle(ref.current as HTMLDivElement).gap).toBe('13px');
  expect(
    getComputedStyle(page.getByRole('radio', { name: 'Styled alpha' }).element())
      .cursor,
  ).toBe('default');
});

test('renders on the server and hydrates selection without recovery', async () => {
  function HydratedRadioGroup() {
    return (
      <TRRadioGroup aria-label="Hydrated racks" defaultValue="beta" name="rack">
        <TRRadio.Root aria-label="Hydrated alpha" value="alpha" />
        <TRRadio.Root aria-label="Hydrated beta" value="beta">
          <TRRadio.Indicator />
        </TRRadio.Root>
      </TRRadioGroup>
    );
  }

  const host = document.createElement('div');
  host.innerHTML = renderToString(<HydratedRadioGroup />);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, <HydratedRadioGroup />, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('[aria-label="Hydrated beta"]')).toHaveAttribute(
    'aria-checked',
    'true',
  );

  await act(async () => root.unmount());
  host.remove();
});
