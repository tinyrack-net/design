import './checkbox-group.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRCheckbox } from '../checkbox/index.js';
import { TRCheckboxGroup } from './index.js';

test('renders the Tinyrack TRCheckboxGroup wrapper', async () => {
  expect(typeof TRCheckboxGroup).toBe('function');
  const ref = createRef<HTMLDivElement>();
  await render(
    <TRCheckboxGroup aria-label="Options" className="consumer-group" ref={ref}>
      Options
    </TRCheckboxGroup>,
  );
  expect(ref.current?.classList.contains('tr-checkbox-group')).toBe(true);
  expect(ref.current?.classList.contains('consumer-group')).toBe(true);
});

test('preserves controlled values and forwards a callback ref', async () => {
  let root: HTMLDivElement | null = null;
  await render(
    <form>
      <TRCheckboxGroup
        aria-label="Controlled features"
        ref={(node) => {
          root = node;
        }}
        value={['metrics']}
      >
        <TRCheckbox.Root aria-label="Metrics" name="features" value="metrics" />
        <TRCheckbox.Root aria-label="Alerts" name="features" value="alerts" />
      </TRCheckboxGroup>
    </form>,
  );

  expect(root).toHaveClass('tr-checkbox-group');
  const form = document.querySelector('form') as HTMLFormElement;
  form.reset();
  expect(new FormData(form).getAll('features')).toEqual(['metrics']);
});

test('coordinates named options, native FormData, reset, and disabled state', async () => {
  const onValueChange = vi.fn();
  const screen = await render(
    <form>
      <TRCheckboxGroup
        aria-label="Rack features"
        defaultValue={['metrics']}
        onValueChange={onValueChange}
      >
        <TRCheckbox.Root aria-label="Metrics" name="features" value="metrics" />
        <TRCheckbox.Root aria-label="Alerts" name="features" value="alerts" />
      </TRCheckboxGroup>
      <TRCheckboxGroup aria-label="Locked features" disabled>
        <TRCheckbox.Root aria-label="Backups" name="locked" value="backups" />
      </TRCheckboxGroup>
      <button type="reset">Reset</button>
    </form>,
  );

  const form = document.querySelector('form') as HTMLFormElement;
  const controls = Array.from(
    document.querySelectorAll<HTMLElement>('[role="checkbox"]'),
  );
  const [metrics, alerts, backups] = controls;
  expect(metrics?.getAttribute('aria-checked')).toBe('true');
  expect(backups?.getAttribute('aria-disabled')).toBe('true');

  alerts?.click();
  await expect.poll(() => alerts?.getAttribute('aria-checked')).toBe('true');
  expect(onValueChange.mock.calls.at(-1)?.[0]).toEqual(['metrics', 'alerts']);
  expect(new FormData(form).getAll('features')).toEqual(['metrics', 'alerts']);

  backups?.click();
  expect(new FormData(form).getAll('locked')).toEqual([]);
  form.reset();
  await expect
    .poll(() =>
      Array.from(
        document.querySelectorAll<HTMLElement>('[role="checkbox"]'),
      )[1]?.getAttribute('aria-checked'),
    )
    .toBe('false');
  expect(new FormData(form).getAll('features')).toEqual(['metrics']);
  await screen.unmount();
});

test('resets from the form actually owned by descendant checkbox inputs', async () => {
  await render(
    <>
      <form id="external-feature-form" />
      <TRCheckboxGroup aria-label="External rack features" defaultValue={['metrics']}>
        <TRCheckbox.Root
          aria-label="External metrics"
          form="external-feature-form"
          name="features"
          value="metrics"
        />
        <TRCheckbox.Root
          aria-label="External alerts"
          form="external-feature-form"
          name="features"
          value="alerts"
        />
      </TRCheckboxGroup>
    </>,
  );

  const form = document.querySelector<HTMLFormElement>('#external-feature-form');
  const group = document.querySelector<HTMLElement>(
    '[role="group"][aria-label="External rack features"]',
  );
  expect(
    Array.from(group?.querySelectorAll<HTMLInputElement>('input') ?? []).map(
      (input) => input.form?.id,
    ),
  ).toEqual(['external-feature-form', 'external-feature-form']);
  const currentAlerts = () =>
    document.querySelector<HTMLElement>(
      '[role="checkbox"][aria-label="External alerts"]',
    );
  const alerts = currentAlerts();
  alerts?.click();
  await expect.poll(() => alerts?.getAttribute('aria-checked')).toBe('true');
  expect(new FormData(form as HTMLFormElement).getAll('features')).toEqual([
    'metrics',
    'alerts',
  ]);

  form?.reset();
  await expect.poll(() => currentAlerts()?.getAttribute('aria-checked')).toBe('false');
  expect(new FormData(form as HTMLFormElement).getAll('features')).toEqual(['metrics']);
});

test('ignores reset events from targets that do not own descendant inputs', async () => {
  await render(
    <>
      <form aria-label="Unrelated form" />
      <TRCheckboxGroup aria-label="Standalone features" defaultValue={['metrics']}>
        <TRCheckbox.Root aria-label="Standalone metrics" value="metrics" />
        <TRCheckbox.Root aria-label="Standalone alerts" value="alerts" />
      </TRCheckboxGroup>
    </>,
  );

  const currentAlerts = () =>
    document.querySelector<HTMLElement>(
      '[role="checkbox"][aria-label="Standalone alerts"]',
    );
  currentAlerts()?.click();
  await expect.poll(() => currentAlerts()?.getAttribute('aria-checked')).toBe('true');

  document.querySelector<HTMLFormElement>('form')?.reset();
  document.body.dispatchEvent(new Event('reset', { bubbles: true }));

  expect(currentAlerts()?.getAttribute('aria-checked')).toBe('true');
});

test('stays safe when a polymorphic renderer does not produce a host node', async () => {
  function EmptyRender() {
    return null;
  }

  await render(
    <>
      <form id="hostless-render-form" />
      <TRCheckboxGroup aria-label="Hostless features" render={<EmptyRender />} />
    </>,
  );

  const form = document.querySelector<HTMLFormElement>('#hostless-render-form');
  expect(() => form?.reset()).not.toThrow();
});
