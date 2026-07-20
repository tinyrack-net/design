import '../../core/core.css';
import './icon-button.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRIconButton } from './index.js';

test('reuses TRButton variants while exposing an icon-only accessible name', async () => {
  const ref = createRef<HTMLButtonElement>();
  const onClick = vi.fn();
  await render(
    <TRIconButton
      appearance="ghost"
      aria-label="Open navigation"
      onClick={onClick}
      ref={ref}
      uiSize="sm"
      variant="primary"
    >
      <svg aria-hidden="true" />
    </TRIconButton>,
  );

  expect(ref.current?.classList.contains('tr-btn')).toBe(true);
  expect(ref.current?.classList.contains('tr-icon-btn')).toBe(true);
  expect(ref.current?.getAttribute('aria-label')).toBe('Open navigation');
  expect(ref.current?.dataset['appearance']).toBe('ghost');
  expect(ref.current?.getBoundingClientRect().width).toBe(
    ref.current?.getBoundingClientRect().height,
  );
  await userEvent.click(ref.current as HTMLButtonElement);
  expect(onClick).toHaveBeenCalledOnce();
});

test('supports aria-labelledby and TRButton loading behavior', async () => {
  await render(
    <div>
      <span id="save-label">Save rack</span>
      <TRIconButton aria-labelledby="save-label" loading loadingLabel="Saving rack">
        <svg aria-hidden="true" />
      </TRIconButton>
    </div>,
  );
  const button = document.querySelector<HTMLButtonElement>('.tr-icon-btn');
  expect(button?.disabled).toBe(true);
  expect(button?.getAttribute('aria-label')).toBe('Saving rack');
  expect(button?.hasAttribute('aria-labelledby')).toBe(false);
  expect(button?.querySelectorAll('svg')).toHaveLength(0);
  expect(button?.querySelector('.tr-spinner')).not.toBeNull();
});

test('preserves aria-labelledby while explicitly not loading', async () => {
  await render(
    <div>
      <span id="inspect-label">Inspect rack</span>
      <TRIconButton aria-labelledby="inspect-label" loading={false}>
        <svg aria-hidden="true" />
      </TRIconButton>
    </div>,
  );

  const button = document.querySelector<HTMLButtonElement>('.tr-icon-btn');
  expect(button?.getAttribute('aria-labelledby')).toBe('inspect-label');
  expect(button?.disabled).toBe(false);
  expect(button?.querySelectorAll('svg')).toHaveLength(1);
});

test('keeps a large icon square without shrinking it inside the touch target', async () => {
  await render(
    <TRIconButton aria-label="Open navigation" uiSize="lg">
      <svg aria-hidden="true" viewBox="0 0 24 24" />
    </TRIconButton>,
  );
  const button = document.querySelector<HTMLButtonElement>('.tr-icon-btn');
  const icon = button?.querySelector('svg');

  expect(button?.getBoundingClientRect().width).toBe(48);
  expect(button?.getBoundingClientRect().height).toBe(48);
  expect(icon?.getBoundingClientRect().width).toBe(24);
  expect(icon?.getBoundingClientRect().height).toBe(24);
  if (icon === null || icon === undefined)
    throw new Error('Missing TRIconButton icon.');
  expect(getComputedStyle(icon).flexShrink).toBe('0');
});
