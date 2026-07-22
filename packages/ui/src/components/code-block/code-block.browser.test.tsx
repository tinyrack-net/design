import '../../core/core.css';
import './code-block.css';
import { act, type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import type { ThemedToken } from 'shiki/bundle/web';
import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { styleForToken } from './code-block.js';
import { TRCodeBlock } from './index.js';

const shikiCodeToTokens = vi.hoisted(() => vi.fn());

vi.mock('shiki/bundle/web', async (importOriginal) => {
  const shiki = await importOriginal<typeof import('shiki/bundle/web')>();
  shikiCodeToTokens.mockImplementation(shiki.codeToTokens);
  return { ...shiki, codeToTokens: shikiCodeToTokens };
});

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
});

function renderedThemeColors(element: HTMLPreElement | null) {
  const token = element?.querySelector('span');

  if (element === null || token === null || token === undefined) {
    return null;
  }

  return {
    background: getComputedStyle(element).backgroundColor,
    token: getComputedStyle(token).color,
  };
}

test('renders code and progressively highlights a supported language', async () => {
  const ref = createRef<HTMLPreElement>();
  await render(
    <TRCodeBlock ref={ref} code={'\nconst answer = 42;\n'} language="ts" wrap />,
  );

  expect(ref.current?.classList.contains('tr-code-block')).toBe(true);
  expect(ref.current?.dataset['language']).toBe('ts');
  expect(ref.current?.dataset['wrap']).toBe('true');
  await expect
    .poll(() => ref.current?.dataset['highlighted'], { timeout: 10_000 })
    .toBe('true');
});

test('renders plain code without loading a highlighter', async () => {
  const ref = createRef<HTMLPreElement>();
  await render(
    <TRCodeBlock ref={ref} code="plain text" style={{ color: 'inherit' }} />,
  );
  expect(ref.current?.dataset['highlighted']).toBeUndefined();
  expect(ref.current?.textContent).toBe('plain text');
});

test('preserves semantic markup, native props, consumer classes, events, and refs', async () => {
  const ref = createRef<HTMLPreElement>();
  const onCopy = vi.fn();
  const screen = await render(
    <TRCodeBlock
      aria-label="Deployment command"
      className="consumer-code-block"
      code="pnpm verify"
      data-consumer="preserved"
      onCopy={onCopy}
      ref={ref}
      style={{ maxHeight: '12rem' }}
      tabIndex={0}
    />,
  );
  const codeBlock = screen.getByLabelText('Deployment command');

  expect(ref.current).toBe(codeBlock.element());
  expect(ref.current?.tagName).toBe('PRE');
  expect(ref.current?.querySelector('code')?.textContent).toBe('pnpm verify');
  expect(ref.current?.classList).toContain('consumer-code-block');
  expect(ref.current?.dataset['consumer']).toBe('preserved');
  expect(ref.current?.style.maxHeight).toBe('12rem');
  expect(ref.current?.tabIndex).toBe(0);
  ref.current?.dispatchEvent(new ClipboardEvent('copy', { bubbles: true }));
  expect(onCopy).toHaveBeenCalledOnce();
});

test('scrolls unwrapped source and contains wrapped source in a narrow parent', async () => {
  const longLine = `const rack = '${'rack-'.repeat(30)}';`;
  const { rerender } = await render(
    <div data-testid="boundary" style={{ width: '160px' }}>
      <TRCodeBlock code={longLine} data-testid="source" />
    </div>,
  );
  const boundary = document.querySelector<HTMLElement>('[data-testid="boundary"]');
  const source = document.querySelector<HTMLPreElement>('[data-testid="source"]');

  expect(source?.clientWidth).toBeLessThanOrEqual(boundary?.clientWidth ?? 0);
  expect(source?.scrollWidth).toBeGreaterThan(source?.clientWidth ?? 0);
  expect(getComputedStyle(source as HTMLPreElement).whiteSpace).toBe('pre');

  await rerender(
    <div data-testid="boundary" style={{ width: '160px' }}>
      <TRCodeBlock code={longLine} data-testid="source" wrap />
    </div>,
  );

  expect(source?.scrollWidth).toBe(source?.clientWidth);
  expect(getComputedStyle(source as HTMLPreElement).whiteSpace).toBe('pre-wrap');
});

test('preserves component color tokens after syntax highlighting', async () => {
  const ref = createRef<HTMLPreElement>();
  await render(
    <TRCodeBlock
      code="const healthy = true;"
      language="ts"
      ref={ref}
      style={
        {
          '--tr-code-block-background': 'rgb(1, 2, 3)',
          '--tr-code-block-color': 'rgb(4, 5, 6)',
        } as CSSProperties
      }
    />,
  );
  await expect
    .poll(() => ref.current?.dataset['highlighted'], { timeout: 10_000 })
    .toBe('true');

  expect(getComputedStyle(ref.current as HTMLPreElement).backgroundColor).toBe(
    'rgb(1, 2, 3)',
  );
  expect(getComputedStyle(ref.current as HTMLPreElement).color).toBe('rgb(4, 5, 6)');
});

test('uses semantic CSS fallbacks when highlighting omits root colors', async () => {
  shikiCodeToTokens.mockResolvedValueOnce({
    bg: undefined,
    fg: undefined,
    tokens: [[{ content: 'const healthy = true;', offset: 0 }]],
  });
  await render(
    <>
      <TRCodeBlock
        code="const healthy = true;"
        data-testid="highlighted"
        language="ts"
      />
      <TRCodeBlock code="plain fallback" data-testid="plain" />
    </>,
  );
  const highlighted = document.querySelector<HTMLPreElement>(
    '[data-testid="highlighted"]',
  );
  const plain = document.querySelector<HTMLPreElement>('[data-testid="plain"]');
  await expect
    .poll(() => highlighted?.dataset['highlighted'], { timeout: 10_000 })
    .toBe('true');

  expect(highlighted?.style.backgroundColor).toBe('');
  expect(highlighted?.style.color).toBe('');
  expect(getComputedStyle(highlighted as HTMLPreElement).backgroundColor).toBe(
    getComputedStyle(plain as HTMLPreElement).backgroundColor,
  );
  expect(getComputedStyle(highlighted as HTMLPreElement).color).toBe(
    getComputedStyle(plain as HTMLPreElement).color,
  );
  expect(highlighted?.textContent).toBe('const healthy = true;');
});

test('keeps an async highlight result bound to the latest code and language', async () => {
  const { rerender } = await render(
    <TRCodeBlock code="const stale = true;" language="ts" />,
  );
  await rerender(<TRCodeBlock code="body { color: red; }" language="css" />);
  const element = document.querySelector<HTMLPreElement>('.tr-code-block');
  await expect
    .poll(() => element?.dataset['highlighted'], { timeout: 10_000 })
    .toBe('true');
  expect(element?.dataset['language']).toBe('css');
  expect(element?.textContent).toBe('body { color: red; }');
  expect(element?.textContent).not.toContain('stale');
});

test('tracks Tinyrack light and dark themes without re-highlighting', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const ref = createRef<HTMLPreElement>();
  await render(<TRCodeBlock ref={ref} code="const answer = 42;" language="ts" />);

  await expect
    .poll(() => ref.current?.dataset['highlighted'], { timeout: 10_000 })
    .toBe('true');
  expect(renderedThemeColors(ref.current)).toEqual({
    background: 'rgb(255, 255, 255)',
    token: 'rgb(160, 17, 31)',
  });
  const highlightedMarkup = ref.current?.innerHTML;

  document.documentElement.dataset['theme'] = 'tinyrack-dark';

  await expect
    .poll(() => renderedThemeColors(ref.current))
    .toEqual({
      background: 'rgb(10, 12, 16)',
      token: 'rgb(255, 148, 146)',
    });
  expect(ref.current?.innerHTML).toBe(highlightedMarkup);
});

test('maps every Shiki token style without leaking token metadata', () => {
  const fullStyle = styleForToken({
    bgColor: '#000000',
    color: '#ffffff',
    content: 'styled',
    fontStyle: 7,
    offset: 0,
  } as unknown as ThemedToken);
  const emptyStyle = styleForToken({
    content: 'plain',
    offset: 0,
  } as ThemedToken);
  const resetStyle = styleForToken({
    content: 'reset',
    fontStyle: 0,
    offset: 0,
  } as ThemedToken);
  const htmlStyle = { color: 'rebeccapurple' };

  expect(fullStyle).toEqual({
    backgroundColor: '#000000',
    color: '#ffffff',
    fontStyle: 'italic',
    fontWeight: 700,
    textDecoration: 'underline',
  });
  expect(emptyStyle).toBeUndefined();
  expect(resetStyle).toBeUndefined();
  expect(styleForToken({ content: 'html', htmlStyle, offset: 0 } as ThemedToken)).toBe(
    htmlStyle,
  );
});

test('hydrates the plain fallback before progressive highlighting', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const serverMarkup = renderToString(
    <TRCodeBlock code="const healthy = true;" language="ts" />,
  );
  const host = document.createElement('div');
  host.innerHTML = serverMarkup;
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(
    host,
    <TRCodeBlock code="const healthy = true;" language="ts" />,
    {
      onRecoverableError(error) {
        hydrationErrors.push(error);
      },
    },
  );
  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('code')?.textContent).toBe('const healthy = true;');
  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});
