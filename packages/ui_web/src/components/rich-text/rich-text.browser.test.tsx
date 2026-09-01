import '../../core/core.css';
import './rich-text.css';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRRichText } from './index.js';

test('preserves defaults, native props, events, refs, and consumer classes', async () => {
  const ref = createRef<HTMLDivElement>();
  const onClick = vi.fn();

  await render(
    <TRRichText
      aria-label="Policy summary"
      className="consumer-rich-text"
      onClick={onClick}
      ref={ref}
    >
      <p>Current policy</p>
    </TRRichText>,
  );

  ref.current?.click();
  expect(onClick).toHaveBeenCalledOnce();
  expect(ref.current).toHaveClass('tr-rich-text', 'consumer-rich-text');
  expect(ref.current?.dataset['variant']).toBe('document');
  expect(ref.current?.getAttribute('aria-label')).toBe('Policy summary');
});

test('styles semantic document content in light and dark themes', async () => {
  const screen = await render(
    (['tinyrack-light', 'tinyrack-dark'] as const).map((theme) => (
      <div data-theme={theme} key={theme}>
        <TRRichText data-testid={theme}>
          <h2>Policy</h2>
          <p>
            Read the <strong>current</strong> <a href="/terms">terms</a> and{' '}
            <code>version</code>.
          </p>
          <ul>
            <li>Required</li>
            <li>Localized</li>
          </ul>
        </TRRichText>
      </div>
    )),
  );

  for (const theme of ['tinyrack-light', 'tinyrack-dark'] as const) {
    const root = screen.getByTestId(theme).element() as HTMLElement;
    const heading = root.querySelector('h2') as HTMLElement;
    const paragraph = root.querySelector('p') as HTMLElement;
    const code = root.querySelector('code') as HTMLElement;
    const link = root.querySelector('a') as HTMLElement;
    const list = root.querySelector('ul') as HTMLElement;

    expect(Number.parseFloat(getComputedStyle(heading).fontSize)).toBeGreaterThan(
      Number.parseFloat(getComputedStyle(paragraph).fontSize),
    );
    expect(getComputedStyle(heading).fontWeight).not.toBe('400');
    expect(getComputedStyle(code).fontFamily).not.toBe(
      getComputedStyle(paragraph).fontFamily,
    );
    expect(getComputedStyle(link).textDecorationLine).toContain('underline');
    expect(getComputedStyle(list).listStyleType).toBe('disc');

    await userEvent.hover(link);
    await expect
      .poll(() => Number.parseFloat(getComputedStyle(link).opacity))
      .toBeLessThan(1);
    await userEvent.unhover(link);

    link.focus();
    expect(getComputedStyle(link).outlineStyle).toBe('solid');
  }
});

test('uses compact muted typography for notices', async () => {
  const screen = await render(
    <>
      <TRRichText data-testid="document">
        <p>Document copy</p>
      </TRRichText>
      <TRRichText data-testid="notice" variant="notice">
        <p>
          Continuing means that you accept the <strong>terms</strong>.
        </p>
        <ul>
          <li>Terms</li>
        </ul>
      </TRRichText>
    </>,
  );
  const root = screen.getByTestId('notice').element() as HTMLElement;
  const documentRoot = screen.getByTestId('document').element() as HTMLElement;
  const paragraph = root.querySelector('p') as HTMLElement;
  const strong = root.querySelector('strong') as HTMLElement;

  expect(root.dataset['variant']).toBe('notice');
  expect(getComputedStyle(root).color).toBe(getComputedStyle(paragraph).color);
  expect(getComputedStyle(strong).color).toBe(getComputedStyle(root).color);
  expect(Number.parseFloat(getComputedStyle(root).fontSize)).toBeLessThan(
    Number.parseFloat(getComputedStyle(documentRoot).fontSize),
  );
});

test('renders deterministic server markup without a client-only boundary', () => {
  expect(
    renderToString(
      <TRRichText variant="notice">
        <p>Server-rendered notice</p>
      </TRRichText>,
    ),
  ).toContain('class="tr-rich-text" data-variant="notice"');
});
