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
  // A single width only catches the overflow when the line break happens to
  // land badly, which depends on font advances and so differs per platform.
  // Sweeping widths puts several break positions under test on every machine.
  const widths = [96, 104, 112, 120, 128, 136, 144, 152, 160];

  await render(
    widths.map((width) => (
      <div data-testid={`context-${width}`} key={width} style={{ width: `${width}px` }}>
        <TRCode data-testid={`long-token-${width}`}>
          very-long-rack-identifier-with-overflow-safe-wrapping-01
        </TRCode>
      </div>
    )),
  );

  for (const width of widths) {
    const context = document.querySelector<HTMLElement>(
      `[data-testid="context-${width}"]`,
    ) as HTMLElement;
    const code = document.querySelector<HTMLElement>(
      `[data-testid="long-token-${width}"]`,
    ) as HTMLElement;

    expect
      .soft(code.getBoundingClientRect().width, `width=${width}`)
      .toBeLessThanOrEqual(context.getBoundingClientRect().width);
    expect.soft(context.scrollWidth, `width=${width}`).toBe(context.clientWidth);

    // The inline box fragments into one rect per line. Cloned decorations add
    // padding to every fragment after the break is chosen, so check each line
    // rather than only the union, which can hide a single overflowing line.
    const contextRect = context.getBoundingClientRect();
    for (const [index, rect] of [...code.getClientRects()].entries()) {
      expect
        .soft(rect.right, `width=${width} line=${index}`)
        .toBeLessThanOrEqual(contextRect.right + 0.5);
      expect
        .soft(rect.left, `width=${width} line=${index}`)
        .toBeGreaterThanOrEqual(contextRect.left - 0.5);
    }
  }
});
