import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CodeBlock } from './react.js';
import { ShikiCodeBlock } from './shiki-react.js';

describe('CodeBlock SSR output', () => {
  it('escapes plain code without requiring browser APIs', () => {
    const html = renderToString(createElement(CodeBlock, null, '<script />'));

    expect(html).toBe('<pre class="tr-code-block"><code>&lt;script /&gt;</code></pre>');
  });

  it('renders ShikiCodeBlock as the same plain fallback before hydration', () => {
    const html = renderToString(
      createElement(ShikiCodeBlock, {
        code: 'const a = 1',
        language: 'ts',
      }),
    );

    expect(html).toBe(
      '<pre class="tr-code-block" data-language="ts"><code>const a = 1</code></pre>',
    );
    expect(html).not.toContain('<span');
    expect(html).not.toContain('style=');
  });
});
