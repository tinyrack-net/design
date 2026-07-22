import '../../core/core.css';
import './toggle.css';
import { act, type CSSProperties, createRef, type FormEvent, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRToggle } from './index.js';

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

test('renders the Tinyrack TRToggle wrapper', async () => {
  expect(typeof TRToggle).toBe('function');
  await render(
    <TRToggle aria-label="Bold" defaultPressed>
      Bold
    </TRToggle>,
  );
  expect(document.querySelector('.tr-toggle')).not.toBeNull();
});

test('preserves controlled pressed state and native button props', async () => {
  function ControlledToggle() {
    const [pressed, setPressed] = useState(false);

    return (
      <>
        <TRToggle
          data-testid="toggle"
          onPressedChange={setPressed}
          pressed={pressed}
          type="button"
        >
          Bold
        </TRToggle>
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

test('preserves refs, native events, render, and state-based class names', async () => {
  const onClick = vi.fn();
  const ref = createRef<HTMLButtonElement>();

  await render(
    <TRToggle
      className={({ pressed }) => `consumer-toggle consumer-toggle-${pressed}`}
      data-owner="editor"
      defaultPressed
      onClick={onClick}
      ref={ref}
      render={<button data-rendered="toggle" type="button" />}
    >
      Underline
    </TRToggle>,
  );

  const toggle = page.getByRole('button', { name: 'Underline' });
  expect(ref.current).toBe(toggle.element());
  expect(toggle.element().dataset['owner']).toBe('editor');
  expect(toggle.element().dataset['rendered']).toBe('toggle');
  expect(toggle.element().classList.contains('tr-toggle')).toBe(true);
  expect(toggle.element().classList.contains('consumer-toggle-true')).toBe(true);

  await toggle.click();
  expect(onClick).toHaveBeenCalledTimes(1);
  await expect
    .poll(() => toggle.element().classList.contains('consumer-toggle-false'))
    .toBe(true);
});

test('keeps externally controlled state immutable and supports canceled changes', async () => {
  const onControlledChange = vi.fn();
  const onCanceledChange = vi.fn((_pressed, details) => details.cancel());

  await render(
    <>
      <TRToggle pressed onPressedChange={onControlledChange}>
        Controlled
      </TRToggle>
      <TRToggle defaultPressed onPressedChange={onCanceledChange}>
        Canceled
      </TRToggle>
    </>,
  );

  const controlled = page.getByRole('button', { name: 'Controlled' });
  const canceled = page.getByRole('button', { name: 'Canceled' });
  await controlled.click();
  await canceled.click();

  expect(controlled.element().getAttribute('aria-pressed')).toBe('true');
  expect(onControlledChange.mock.calls.at(-1)?.[0]).toBe(false);
  expect(canceled.element().getAttribute('aria-pressed')).toBe('true');
  expect(onCanceledChange.mock.calls.at(-1)?.[0]).toBe(false);
});

test('preserves native button keyboard behavior without submitting its form', async () => {
  const onPressedChange = vi.fn();
  const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
  const ref = createRef<HTMLButtonElement>();

  await render(
    <form onSubmit={onSubmit}>
      <TRToggle data-consumer="format" onPressedChange={onPressedChange} ref={ref}>
        Bold with Space
      </TRToggle>
      <TRToggle onPressedChange={onPressedChange}>Bold with Enter</TRToggle>
      <TRToggle disabled onPressedChange={onPressedChange}>
        Disabled
      </TRToggle>
    </form>,
  );

  const spaceToggle = page.getByRole('button', { name: 'Bold with Space' });
  expect(ref.current).toBe(spaceToggle.element());
  expect(ref.current?.type).toBe('button');
  expect(ref.current?.dataset['consumer']).toBe('format');

  await userEvent.type(spaceToggle, ' ');
  await expect
    .poll(() => spaceToggle.element().getAttribute('aria-pressed'))
    .toBe('true');

  const enterToggle = page.getByRole('button', { name: 'Bold with Enter' });
  await userEvent.type(enterToggle, '{Enter}');
  await expect
    .poll(() => enterToggle.element().getAttribute('aria-pressed'))
    .toBe('true');
  expect(onSubmit).not.toHaveBeenCalled();
  expect(onPressedChange.mock.calls.map(([value]) => value)).toEqual([true, true]);

  const disabled = page.getByRole('button', { name: 'Disabled' });
  await disabled.click({ force: true });
  expect(disabled.element().getAttribute('aria-pressed')).toBe('false');
  expect(onPressedChange).toHaveBeenCalledTimes(2);
});

test('uses control tokens and exposes every interactive visual state', async () => {
  const style = {
    '--tr-toggle-background': 'rgb(250, 250, 250)',
    '--tr-toggle-color': 'rgb(23, 23, 23)',
    '--tr-toggle-disabled-opacity': '0.4',
    '--tr-toggle-hover-background': 'rgb(229, 229, 229)',
    '--tr-toggle-pressed-background': 'rgb(64, 64, 64)',
    '--tr-toggle-pressed-border': 'rgb(163, 163, 163)',
    '--tr-toggle-pressed-color': 'rgb(250, 250, 250)',
  } as CSSProperties;

  await render(
    <div data-theme="tinyrack-dark">
      <TRToggle style={style}>Idle</TRToggle>
      <TRToggle defaultPressed style={style}>
        Pressed
      </TRToggle>
      <TRToggle disabled style={style}>
        Disabled
      </TRToggle>
    </div>,
  );

  const idle = page.getByRole('button', { name: 'Idle' });
  const pressed = page.getByRole('button', { name: 'Pressed' });
  const disabled = page.getByRole('button', { name: 'Disabled' });
  const idleStyle = getComputedStyle(idle.element());

  expect(idleStyle.backgroundColor).toBe('rgb(250, 250, 250)');
  expect(idleStyle.color).toBe('rgb(23, 23, 23)');
  expect(idleStyle.fontSize).toBe('14px');
  expect(idleStyle.lineHeight).toBe('20px');
  expect(idleStyle.minHeight).toBe('40px');

  await idle.hover();
  await expect
    .poll(() => getComputedStyle(idle.element()).backgroundColor)
    .toBe('rgb(229, 229, 229)');

  expect(getComputedStyle(pressed.element()).backgroundColor).toBe('rgb(64, 64, 64)');
  expect(getComputedStyle(pressed.element()).borderColor).toBe('rgb(163, 163, 163)');
  expect(getComputedStyle(pressed.element()).color).toBe('rgb(250, 250, 250)');
  expect(getComputedStyle(disabled.element()).opacity).toBe('0.4');

  idle.element().focus();
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toBe(pressed.element());
  expect(getComputedStyle(pressed.element()).outlineStyle).not.toBe('none');
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).not.toBe(disabled.element());
});

test('server-renders and hydrates pressed state without recovery', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const fixture = <TRToggle defaultPressed>Hydrated bold</TRToggle>;
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  const toggle = host.querySelector<HTMLButtonElement>('button');
  expect(hydrationErrors).toEqual([]);
  expect(toggle?.getAttribute('aria-pressed')).toBe('true');
  toggle?.click();
  await expect.poll(() => toggle?.getAttribute('aria-pressed')).toBe('false');

  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});
