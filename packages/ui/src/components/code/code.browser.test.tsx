import '../../core/core.css';
import './code.css';
import { type CSSProperties, createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRCode } from './index.js';

test('renders semantic inline code', async () => {
  const ref = createRef<HTMLElement>();
  await render(
    <TRCode ref={ref} className="consumer-code" data-language="shell">
      pnpm test
    </TRCode>,
  );
  expect(ref.current?.tagName).toBe('CODE');
  expect(ref.current?.classList.contains('tr-code')).toBe(true);
  expect(ref.current?.classList.contains('consumer-code')).toBe(true);
  expect(ref.current?.dataset['language']).toBe('shell');
});

test('inherits surrounding font size and preserves multiline fragments', async () => {
  await render(
    <p style={{ fontSize: '20px', width: '12rem' }}>
      Run <TRCode data-testid="multiline">{'pnpm test:unit\npnpm test:e2e'}</TRCode>{' '}
      before release.
    </p>,
  );
  const code = document.querySelector<HTMLElement>('[data-testid="multiline"]');
  expect(getComputedStyle(code as HTMLElement).fontSize).toBe('20px');
  expect(getComputedStyle(code as HTMLElement).whiteSpace).toBe('break-spaces');
  expect(code?.textContent).toBe('pnpm test:unit\npnpm test:e2e');
});

test('uses semantic colors in light and dark contexts', async () => {
  await render(
    <>
      <div data-theme="tinyrack-light">
        <TRCode data-testid="light">pnpm verify</TRCode>
      </div>
      <div data-theme="tinyrack-dark">
        <TRCode data-testid="dark">pnpm verify</TRCode>
      </div>
    </>,
  );
  const light = getComputedStyle(
    document.querySelector<HTMLElement>('[data-testid="light"]') as HTMLElement,
  );
  const dark = getComputedStyle(
    document.querySelector<HTMLElement>('[data-testid="dark"]') as HTMLElement,
  );
  expect(light.backgroundColor).not.toBe(dark.backgroundColor);
  expect(light.color).not.toBe(dark.color);
  expect(light.borderTopColor).not.toBe(dark.borderTopColor);
});

test('supports component token overrides', async () => {
  await render(
    <TRCode
      data-testid="customized"
      style={
        {
          '--tr-code-border': '#000',
          '--tr-code-border-width': '3px',
          '--tr-code-font-family': 'serif',
        } as CSSProperties
      }
    >
      npm run build
    </TRCode>,
  );
  const code = document.querySelector<HTMLElement>('[data-testid="customized"]');
  const style = getComputedStyle(code as HTMLElement);
  expect(style.borderTopWidth).toBe('3px');
  expect(style.fontFamily).toBe('serif');
});

test('wraps long tokens without overflowing a narrow content context', async () => {
  await render(
    <div data-testid="context" style={{ width: '128px' }}>
      <TRCode data-testid="long-token">
        very-long-rack-identifier-with-overflow-safe-wrapping-01
      </TRCode>
    </div>,
  );
  const context = document.querySelector<HTMLElement>('[data-testid="context"]');
  const code = document.querySelector<HTMLElement>('[data-testid="long-token"]');
  expect((code as HTMLElement).getBoundingClientRect().width).toBeLessThanOrEqual(
    (context as HTMLElement).getBoundingClientRect().width,
  );
  expect((context as HTMLElement).scrollWidth).toBe(
    (context as HTMLElement).clientWidth,
  );
});
