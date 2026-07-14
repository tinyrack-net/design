import './code-block.css';
import { act, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import type { ThemedToken } from 'shiki/bundle/web';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { styleForToken } from './code-block.js';
import { CodeBlock } from './index.js';

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

test('renders code and progressively highlights a supported language', async () => {
  const ref = createRef<HTMLPreElement>();
  await render(
    <CodeBlock ref={ref} code={'\nconst answer = 42;\n'} language="ts" wrap />,
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
  await render(<CodeBlock ref={ref} code="plain text" style={{ color: 'inherit' }} />);
  expect(ref.current?.dataset['highlighted']).toBeUndefined();
  expect(ref.current?.textContent).toBe('plain text');
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
    <CodeBlock code="const healthy = true;" language="ts" />,
  );
  const host = document.createElement('div');
  host.innerHTML = serverMarkup;
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(
    host,
    <CodeBlock code="const healthy = true;" language="ts" />,
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
