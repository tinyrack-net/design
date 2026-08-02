import '../../core/core.css';
import './code-block.css';
import { act, type CSSProperties, createRef } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { trShikiWebHighlighter } from '../../highlighters/shiki-web/index.js';
import { TRCodeHighlighterProvider } from '../../providers/highlighter/index.js';
import { styleForToken } from './code-block.js';
import type {
  TRCodeHighlighter,
  TRCodeHighlightFailure,
  TRCodeToken,
} from './code-block-highlighter.js';
import { TRCodeBlock } from './index.js';

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
    <TRCodeBlock
      code={'\nconst answer = 42;\n'}
      highlighter={trShikiWebHighlighter}
      language="ts"
      ref={ref}
      wrap
    />,
  );

  expect(ref.current?.classList.contains('tr-code-block')).toBe(true);
  expect(ref.current?.dataset['language']).toBe('ts');
  expect(ref.current?.dataset['wrap']).toBe('true');
  await expect
    .poll(() => ref.current?.dataset['highlighted'], { timeout: 10_000 })
    .toBe('true');
  expect(ref.current?.dataset['highlight']).toBe('highlighted');
});

test('renders plain code without consulting a highlighter', async () => {
  const highlighter = vi.fn<TRCodeHighlighter>();
  const ref = createRef<HTMLPreElement>();
  await render(
    <TRCodeBlock
      code="plain text"
      highlighter={highlighter}
      ref={ref}
      style={{ color: 'inherit' }}
    />,
  );
  expect(ref.current?.dataset['highlighted']).toBeUndefined();
  expect(ref.current?.dataset['highlight']).toBe('plain');
  expect(ref.current?.textContent).toBe('plain text');
  expect(highlighter).not.toHaveBeenCalled();
});

test('takes the highlighter from context and lets the prop override it', async () => {
  const contextHighlighter = vi.fn<TRCodeHighlighter>(async () => null);
  const propHighlighter = vi.fn<TRCodeHighlighter>(async () => null);

  await render(
    <TRCodeHighlighterProvider
      highlighter={contextHighlighter}
      onHighlightFailure={() => {}}
    >
      <TRCodeBlock code="a" data-testid="from-context" language="ts" />
      <TRCodeBlock
        code="b"
        data-testid="from-prop"
        highlighter={propHighlighter}
        language="ts"
      />
    </TRCodeHighlighterProvider>,
  );

  await expect.poll(() => contextHighlighter.mock.calls.length).toBe(1);
  expect(contextHighlighter).toHaveBeenCalledWith({ code: 'a', language: 'ts' });
  expect(propHighlighter).toHaveBeenCalledWith({ code: 'b', language: 'ts' });
});

test('reports an unsupported language and keeps the plain rendering', async () => {
  const failures: TRCodeHighlightFailure[] = [];
  const ref = createRef<HTMLPreElement>();
  await render(
    <TRCodeBlock
      code="print('hi')"
      highlighter={async () => null}
      language="brainfuck"
      onHighlightFailure={(failure) => failures.push(failure)}
      ref={ref}
    />,
  );

  await expect
    .poll(() => ref.current?.dataset['highlight'], { timeout: 10_000 })
    .toBe('unsupported');
  expect(ref.current?.dataset['highlighted']).toBeUndefined();
  expect(ref.current?.textContent).toBe("print('hi')");
  expect(failures).toEqual([
    {
      code: "print('hi')",
      error: undefined,
      language: 'brainfuck',
      reason: 'unsupported-language',
    },
  ]);
});

test('reports a thrown highlighter error instead of swallowing it', async () => {
  const failures: TRCodeHighlightFailure[] = [];
  const error = new Error('grammar exploded');
  const ref = createRef<HTMLPreElement>();
  await render(
    <TRCodeBlock
      code="const a = 1;"
      highlighter={async () => {
        throw error;
      }}
      language="ts"
      onHighlightFailure={(failure) => failures.push(failure)}
      ref={ref}
    />,
  );

  await expect
    .poll(() => ref.current?.dataset['highlight'], { timeout: 10_000 })
    .toBe('error');
  expect(ref.current?.textContent).toBe('const a = 1;');
  expect(failures[0]?.reason).toBe('highlight-failed');
  expect(failures[0]?.error).toBe(error);
});

test('reports a missing highlighter when a language is requested', async () => {
  const failures: TRCodeHighlightFailure[] = [];
  const ref = createRef<HTMLPreElement>();
  await render(
    <TRCodeBlock
      code="const a = 1;"
      language="ts"
      onHighlightFailure={(failure) => failures.push(failure)}
      ref={ref}
    />,
  );

  await expect
    .poll(() => ref.current?.dataset['highlight'], { timeout: 10_000 })
    .toBe('no-highlighter');
  expect(ref.current?.textContent).toBe('const a = 1;');
  expect(failures[0]?.reason).toBe('no-highlighter');
});

test('logs only a thrown highlighter when no handler is registered', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

  await render(
    <>
      <TRCodeBlock code="const a = 1;" data-testid="missing" language="ts" />
      <TRCodeBlock
        code="const b = 2;"
        data-testid="thrown"
        highlighter={async () => {
          throw new Error('grammar exploded');
        }}
        language="tsx"
      />
      {/* An unsupported language renders correctly as plain text, so it stays quiet. */}
      <TRCodeBlock
        code="const c = 3;"
        data-testid="unsupported"
        highlighter={async () => null}
        language="brainfuck"
      />
    </>,
  );

  const stateOf = (testId: string) =>
    document.querySelector<HTMLPreElement>(`[data-testid="${testId}"]`)?.dataset[
      'highlight'
    ];
  await expect
    .poll(() => stateOf('missing'), { timeout: 10_000 })
    .toBe('no-highlighter');
  await expect.poll(() => stateOf('thrown'), { timeout: 10_000 }).toBe('error');
  await expect
    .poll(() => stateOf('unsupported'), { timeout: 10_000 })
    .toBe('unsupported');

  const messages = consoleError.mock.calls.map((call) => String(call[0]));
  expect(
    messages.filter((message) => message.includes('failed to highlight "tsx"')),
  ).toHaveLength(1);
  // A missing highlighter and an unsupported language are configuration states,
  // not faults: they render correct plain text and must stay off the console.
  expect(messages.filter((message) => message.includes('TRCodeBlock'))).toHaveLength(1);
  consoleError.mockRestore();
});

test('does not re-highlight for an inline onHighlightFailure identity', async () => {
  const highlighter = vi.fn<TRCodeHighlighter>(async () => null);

  function Host() {
    // A fresh closure every render is the natural way to write this prop; it
    // must not feed back into the highlighting effect.
    return (
      <TRCodeBlock
        code="const a = 1;"
        highlighter={highlighter}
        language="brainfuck"
        onHighlightFailure={({ language }) => void language}
      />
    );
  }

  await render(<Host />);
  const element = document.querySelector<HTMLPreElement>('.tr-code-block');
  await expect
    .poll(() => element?.dataset['highlight'], { timeout: 10_000 })
    .toBe('unsupported');
  await new Promise((resolve) => setTimeout(resolve, 300));

  expect(highlighter).toHaveBeenCalledTimes(1);
});

test('clears a failure state when the language becomes supported', async () => {
  const highlighter: TRCodeHighlighter = async ({ language }) =>
    language === 'ts'
      ? trShikiWebHighlighter({ code: 'const a = 1;', language })
      : null;
  const { rerender } = await render(
    <TRCodeBlock
      code="const a = 1;"
      highlighter={highlighter}
      language="brainfuck"
      onHighlightFailure={() => {}}
    />,
  );
  const element = document.querySelector<HTMLPreElement>('.tr-code-block');
  await expect
    .poll(() => element?.dataset['highlight'], { timeout: 10_000 })
    .toBe('unsupported');

  await rerender(
    <TRCodeBlock
      code="const a = 1;"
      highlighter={highlighter}
      language="ts"
      onHighlightFailure={() => {}}
    />,
  );

  await expect
    .poll(() => element?.dataset['highlight'], { timeout: 10_000 })
    .toBe('highlighted');
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
      highlighter={trShikiWebHighlighter}
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
  const colorlessHighlighter: TRCodeHighlighter = async ({ code }) => ({
    lines: [[{ content: code, offset: 0 }]],
  });
  await render(
    <>
      <TRCodeBlock
        code="const healthy = true;"
        data-testid="highlighted"
        highlighter={colorlessHighlighter}
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
    <TRCodeBlock
      code="const stale = true;"
      highlighter={trShikiWebHighlighter}
      language="ts"
    />,
  );
  await rerender(
    <TRCodeBlock
      code="body { color: red; }"
      highlighter={trShikiWebHighlighter}
      language="css"
    />,
  );
  const element = document.querySelector<HTMLPreElement>('.tr-code-block');
  await expect
    .poll(() => element?.dataset['highlighted'], { timeout: 10_000 })
    .toBe('true');
  expect(element?.dataset['language']).toBe('css');
  expect(element?.textContent).toBe('body { color: red; }');
  expect(element?.textContent).not.toContain('stale');
});

test('shows new source in the same commit after a resolved highlight', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const highlighter: TRCodeHighlighter = async ({ code }) => ({
    lines: [[{ content: `highlighted:${code}`, offset: 0 }]],
  });
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);

  try {
    await act(async () => {
      root.render(<TRCodeBlock code="old" highlighter={highlighter} language="ts" />);
    });
    await expect.poll(() => host.textContent).toBe('highlighted:old');

    // Observe the prop-change commit before passive effects can reset async
    // state. The source must never show tokens produced for the old request.
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
    flushSync(() => {
      root.render(<TRCodeBlock code="new" highlighter={highlighter} language="ts" />);
    });

    expect(host.textContent).toBe('new');
    expect(host.querySelector('pre')?.dataset['highlight']).toBe('pending');
  } finally {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
    await act(async () => root.unmount());
    host.remove();
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  }
});

test('does not reuse a prior result when returning to the same request', async () => {
  let firstCodeCalls = 0;
  const failures: TRCodeHighlightFailure[] = [];
  const pendingRequest = new Promise<never>(() => {});
  const highlighter = vi.fn<TRCodeHighlighter>(async ({ code }) => {
    if (code === 'second') return pendingRequest;
    firstCodeCalls += 1;
    return firstCodeCalls === 1
      ? { lines: [[{ content: 'highlighted:first', offset: 0 }]] }
      : null;
  });
  const ref = createRef<HTMLPreElement>();
  const onHighlightFailure = (failure: TRCodeHighlightFailure) => {
    failures.push(failure);
  };
  const { rerender } = await render(
    <TRCodeBlock
      code="first"
      highlighter={highlighter}
      language="ts"
      onHighlightFailure={onHighlightFailure}
      ref={ref}
    />,
  );

  await expect.poll(() => ref.current?.dataset['highlight']).toBe('highlighted');
  await rerender(
    <TRCodeBlock
      code="second"
      highlighter={highlighter}
      language="ts"
      onHighlightFailure={onHighlightFailure}
      ref={ref}
    />,
  );
  expect(ref.current?.dataset['highlight']).toBe('pending');

  await rerender(
    <TRCodeBlock
      code="first"
      highlighter={highlighter}
      language="ts"
      onHighlightFailure={onHighlightFailure}
      ref={ref}
    />,
  );
  await expect.poll(() => failures.at(-1)?.reason).toBe('unsupported-language');

  expect(ref.current?.dataset['highlight']).toBe('unsupported');
  expect(ref.current?.dataset['highlighted']).toBeUndefined();
  expect(ref.current?.textContent).toBe('first');
});

test('tracks Tinyrack light and dark themes without re-highlighting', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const ref = createRef<HTMLPreElement>();
  await render(
    <TRCodeBlock
      code="const answer = 42;"
      highlighter={trShikiWebHighlighter}
      language="ts"
      ref={ref}
    />,
  );

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

test('maps every highlight token style without leaking token metadata', () => {
  const fullStyle = styleForToken({
    bgColor: '#000000',
    color: '#ffffff',
    content: 'styled',
    fontStyle: 7,
    offset: 0,
  });
  const emptyStyle = styleForToken({ content: 'plain', offset: 0 });
  const resetStyle = styleForToken({ content: 'reset', fontStyle: 0, offset: 0 });
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
  expect(
    styleForToken({ content: 'html', htmlStyle, offset: 0 } satisfies TRCodeToken),
  ).toBe(htmlStyle);
});

test('hydrates the plain fallback before progressive highlighting', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const block = (
    <TRCodeBlock
      code="const healthy = true;"
      highlighter={trShikiWebHighlighter}
      language="ts"
    />
  );
  const serverMarkup = renderToString(block);
  const host = document.createElement('div');
  host.innerHTML = serverMarkup;
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, block, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });
  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('code')?.textContent).toBe('const healthy = true;');
  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});
