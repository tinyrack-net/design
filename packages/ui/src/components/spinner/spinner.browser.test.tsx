import '../../core/core.css';
import './spinner.css';
import { type CSSProperties, createRef } from 'react';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRSpinner } from './index.js';

test('renders an announced loading indicator', async () => {
  const ref = createRef<HTMLSpanElement>();
  await render(
    <TRSpinner
      className="consumer-spinner"
      data-testid="saving-spinner"
      ref={ref}
      label="Saving"
      style={{ marginLeft: '7px' }}
      uiSize="lg"
      variant="primary"
    />,
  );
  expect(ref.current?.getAttribute('role')).toBe('status');
  expect(ref.current?.getAttribute('aria-label')).toBe('Saving');
  expect(ref.current?.dataset['uiSize']).toBe('lg');
  expect(ref.current?.dataset['variant']).toBe('primary');
  expect(ref.current).toHaveClass('tr-spinner', 'consumer-spinner');
  expect(getComputedStyle(ref.current as HTMLElement).marginLeft).toBe('7px');
});

test('keeps the status named when label contains only whitespace', async () => {
  await render(<TRSpinner label="   " />);
  expect(page.getByRole('status', { name: 'Loading' }).element()).toBeInstanceOf(
    HTMLSpanElement,
  );
});

test('styles the public muted variant independently from current color', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <div style={{ color: 'rgb(255, 0, 255)' }}>
      <TRSpinner data-testid="current" variant="current" />
      <TRSpinner data-testid="muted" variant="muted" />
    </div>,
  );
  const current = document.querySelector<HTMLElement>('[data-testid="current"]');
  const muted = document.querySelector<HTMLElement>('[data-testid="muted"]');
  expect(getComputedStyle(muted as HTMLElement).borderTopColor).not.toBe(
    getComputedStyle(current as HTMLElement).borderTopColor,
  );
});

test('styles every size and semantic color variant', async () => {
  await render(
    <>
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <TRSpinner data-testid={`size-${uiSize}`} key={uiSize} uiSize={uiSize} />
      ))}
      {(['muted', 'primary', 'danger'] as const).map((variant) => (
        <TRSpinner data-testid={`variant-${variant}`} key={variant} variant={variant} />
      ))}
    </>,
  );
  const sizes = (['sm', 'md', 'lg'] as const).map(
    (uiSize) =>
      getComputedStyle(
        document.querySelector(`[data-testid="size-${uiSize}"]`) as HTMLElement,
      ).width,
  );
  const colors = (['muted', 'primary', 'danger'] as const).map(
    (variant) =>
      getComputedStyle(
        document.querySelector(`[data-testid="variant-${variant}"]`) as HTMLElement,
      ).borderTopColor,
  );
  expect(new Set(sizes).size).toBe(3);
  expect(new Set(colors).size).toBe(3);
});

test('supports public size, stroke, and color customization tokens', async () => {
  const ref = createRef<HTMLSpanElement>();
  await render(
    <TRSpinner
      decorative
      ref={ref}
      style={
        {
          '--tr-spinner-color': 'rgb(12, 34, 56)',
          '--tr-spinner-size': '31px',
          '--tr-spinner-stroke-width': '5px',
        } as CSSProperties
      }
    />,
  );
  const styles = getComputedStyle(ref.current as HTMLElement);
  expect(styles.width).toBe('31px');
  expect(styles.borderTopWidth).toBe('5px');
  expect(styles.borderTopColor).toBe('rgb(12, 34, 56)');
});

test('defines a reduced-motion override for the spinner animation', () => {
  const reducedMotionRule = [...document.styleSheets]
    .flatMap((sheet) => [...sheet.cssRules])
    .find(
      (rule) =>
        rule instanceof CSSMediaRule &&
        rule.conditionText === '(prefers-reduced-motion: reduce)',
    ) as CSSMediaRule | undefined;
  const spinnerRule = reducedMotionRule?.cssRules[0] as CSSStyleRule | undefined;
  expect(reducedMotionRule?.cssText).toContain('.tr-spinner');
  expect(spinnerRule?.style.animationName).toBe('none');
});

test('supports a decorative mode for loading indicators inside named controls', async () => {
  const ref = createRef<HTMLSpanElement>();
  await render(<TRSpinner decorative label="Ignored label" ref={ref} />);
  expect(ref.current?.getAttribute('aria-hidden')).toBe('true');
  expect(ref.current?.hasAttribute('aria-label')).toBe(false);
  expect(ref.current?.hasAttribute('role')).toBe(false);
});
