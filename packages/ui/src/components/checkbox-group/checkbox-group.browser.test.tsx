import './checkbox-group.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Checkbox } from '../checkbox/index.js';
import { CheckboxGroup } from './index.js';

test('renders the Tinyrack CheckboxGroup wrapper', async () => {
  expect(typeof CheckboxGroup).toBe('function');
  const ref = createRef<HTMLDivElement>();
  await render(
    <CheckboxGroup aria-label="Options" className="consumer-group" ref={ref}>
      Options
    </CheckboxGroup>,
  );
  expect(ref.current?.classList.contains('tr-checkbox-group')).toBe(true);
  expect(ref.current?.classList.contains('consumer-group')).toBe(true);
});

test('preserves controlled values and forwards a callback ref', async () => {
  let root: HTMLDivElement | null = null;
  await render(
    <form>
      <CheckboxGroup
        aria-label="Controlled features"
        ref={(node) => {
          root = node;
        }}
        value={['metrics']}
      >
        <Checkbox.Root aria-label="Metrics" name="features" value="metrics" />
        <Checkbox.Root aria-label="Alerts" name="features" value="alerts" />
      </CheckboxGroup>
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
      <CheckboxGroup
        aria-label="Rack features"
        defaultValue={['metrics']}
        onValueChange={onValueChange}
      >
        <Checkbox.Root aria-label="Metrics" name="features" value="metrics" />
        <Checkbox.Root aria-label="Alerts" name="features" value="alerts" />
      </CheckboxGroup>
      <CheckboxGroup aria-label="Locked features" disabled>
        <Checkbox.Root aria-label="Backups" name="locked" value="backups" />
      </CheckboxGroup>
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
