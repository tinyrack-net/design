import '../../core/core.css';
import '../checkbox/checkbox.css';
import './checkbox-group.css';
import { act, type CSSProperties, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
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

test('preserves accessible labeling, native props, render props, events, and state classes', async () => {
  const ref = createRef<HTMLDivElement>();
  const onClick = vi.fn();

  await render(
    <>
      <span id="feature-group-label">Rack features</span>
      <TRCheckboxGroup
        aria-labelledby="feature-group-label"
        className={({ disabled }) => `consumer-group ${disabled ? 'locked' : 'ready'}`}
        data-owner="settings"
        onClick={onClick}
        ref={ref}
        render={<section />}
      >
        <TRCheckbox.Root aria-label="Metrics" value="metrics" />
      </TRCheckboxGroup>
    </>,
  );

  const group = page
    .getByRole('group', { name: 'Rack features' })
    .element() as HTMLElement;
  expect(group.tagName).toBe('SECTION');
  expect(group).toBe(ref.current);
  expect(group).toHaveClass('tr-checkbox-group', 'consumer-group', 'ready');
  expect(group).toHaveAttribute('data-owner', 'settings');
  group.click();
  expect(onClick).toHaveBeenCalledOnce();
});

test('runs React 19 callback ref cleanup when the group unmounts', async () => {
  const cleanup = vi.fn();
  const screen = await render(
    <TRCheckboxGroup
      aria-label="Cleanup group"
      ref={(node) => (node ? cleanup : undefined)}
    />,
  );

  expect(cleanup).not.toHaveBeenCalled();
  await screen.unmount();
  expect(cleanup).toHaveBeenCalledOnce();
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

test('preserves controlled updates and event details without changing value itself', async () => {
  const onValueChange = vi.fn();

  function ControlledGroup() {
    const [value, setValue] = useState(['metrics']);
    return (
      <TRCheckboxGroup
        aria-label="Controlled rack features"
        onValueChange={(nextValue, details) => {
          onValueChange(nextValue, details);
          setValue(nextValue);
        }}
        value={value}
      >
        <TRCheckbox.Root aria-label="Controlled metrics" value="metrics" />
        <TRCheckbox.Root aria-label="Controlled alerts" value="alerts" />
      </TRCheckboxGroup>
    );
  }

  await render(<ControlledGroup />);
  await page.getByRole('checkbox', { name: 'Controlled alerts' }).click();
  await expect
    .poll(() =>
      page
        .getByRole('checkbox', { name: 'Controlled alerts' })
        .element()
        .getAttribute('aria-checked'),
    )
    .toBe('true');
  expect(onValueChange).toHaveBeenLastCalledWith(
    ['metrics', 'alerts'],
    expect.objectContaining({ event: expect.any(PointerEvent), reason: 'none' }),
  );
});

test('supports a parent checkbox with mixed, all, and empty values', async () => {
  await render(
    <TRCheckboxGroup
      allValues={['metrics', 'alerts']}
      aria-label="Permissions"
      defaultValue={['metrics']}
    >
      <TRCheckbox.Root aria-label="All permissions" parent />
      <TRCheckbox.Root aria-label="Metrics permission" value="metrics" />
      <TRCheckbox.Root aria-label="Alerts permission" value="alerts" />
    </TRCheckboxGroup>,
  );

  const parent = page.getByRole('checkbox', { name: 'All permissions' });
  const metrics = page.getByRole('checkbox', { name: 'Metrics permission' });
  const alerts = page.getByRole('checkbox', { name: 'Alerts permission' });
  expect(parent.element()).toHaveAttribute('aria-checked', 'mixed');
  await parent.click();
  await expect.poll(() => parent.element().getAttribute('aria-checked')).toBe('true');
  expect(metrics.element()).toHaveAttribute('aria-checked', 'true');
  expect(alerts.element()).toHaveAttribute('aria-checked', 'true');
  await parent.click();
  await expect.poll(() => parent.element().getAttribute('aria-checked')).toBe('false');
  expect(metrics.element()).toHaveAttribute('aria-checked', 'false');
  expect(alerts.element()).toHaveAttribute('aria-checked', 'false');
});

test('blocks read-only and disabled interaction by pointer and keyboard', async () => {
  const onValueChange = vi.fn();
  await render(
    <>
      <TRCheckboxGroup
        aria-label="Read-only options"
        defaultValue={['metrics']}
        onValueChange={onValueChange}
      >
        <TRCheckbox.Root aria-label="Read-only metrics" readOnly value="metrics" />
      </TRCheckboxGroup>
      <TRCheckboxGroup
        aria-label="Disabled options"
        disabled
        onValueChange={onValueChange}
      >
        <TRCheckbox.Root aria-label="Disabled alerts" value="alerts" />
      </TRCheckboxGroup>
    </>,
  );

  const readOnly = page.getByRole('checkbox', { name: 'Read-only metrics' }).element();
  readOnly.focus();
  await userEvent.keyboard(' ');
  expect(readOnly).toHaveAttribute('aria-checked', 'true');
  expect(readOnly).toHaveAttribute('aria-readonly', 'true');
  const disabled = page
    .getByRole('checkbox', {
      name: 'Disabled alerts',
    })
    .element() as HTMLElement;
  expect(disabled.tabIndex).toBe(-1);
  disabled.click();
  expect(disabled).toHaveAttribute('aria-checked', 'false');
  expect(onValueChange).not.toHaveBeenCalled();
});

test('applies group tokens without compounding disabled checkbox opacity', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(
    <TRCheckboxGroup
      aria-label="Styled options"
      disabled
      ref={ref}
      style={
        {
          '--tr-checkbox-group-color': 'rgb(12, 34, 56)',
          '--tr-checkbox-group-gap': '13px',
          '--tinyrack-opacity-disabled': '0.5',
        } as CSSProperties
      }
    >
      <TRCheckbox.Root aria-label="Styled metrics" value="metrics" />
    </TRCheckboxGroup>,
  );

  const groupStyle = getComputedStyle(ref.current as HTMLDivElement);
  const checkboxStyle = getComputedStyle(
    page.getByRole('checkbox', { name: 'Styled metrics' }).element(),
  );
  expect(groupStyle.color).toBe('rgb(12, 34, 56)');
  expect(groupStyle.gap).toBe('13px');
  expect(groupStyle.opacity).toBe('0.5');
  expect(checkboxStyle.opacity).toBe('1');
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

test('server-renders and hydrates uncontrolled and parent state without recovery', async () => {
  function HydratedGroup() {
    return (
      <TRCheckboxGroup
        allValues={['metrics', 'alerts']}
        aria-label="Hydrated features"
        defaultValue={['metrics']}
      >
        <TRCheckbox.Root aria-label="Hydrated all" parent />
        <TRCheckbox.Root aria-label="Hydrated metrics" value="metrics" />
        <TRCheckbox.Root aria-label="Hydrated alerts" value="alerts" />
      </TRCheckboxGroup>
    );
  }

  const host = document.createElement('div');
  host.innerHTML = renderToString(<HydratedGroup />);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, <HydratedGroup />, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('[aria-label="Hydrated all"]')).toHaveAttribute(
    'aria-checked',
    'mixed',
  );
  expect(host.querySelector('[aria-label="Hydrated metrics"]')).toHaveAttribute(
    'aria-checked',
    'true',
  );

  await act(async () => root.unmount());
  host.remove();
});
