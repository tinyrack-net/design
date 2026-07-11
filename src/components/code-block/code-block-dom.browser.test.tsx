import '../../core/core.css';
import './code-block.css';
import { expect, test } from 'vitest';

test.each([false, true])('raw CodeBlock preserves pre/code and wrap=%s', (wrap) => {
  const pre = document.createElement('pre');
  pre.className = 'tr-code-block';
  if (wrap) pre.dataset['wrap'] = 'true';
  const code = document.createElement('code');
  code.textContent = 'const rack = true;';
  pre.append(code);
  document.body.append(pre);
  expect(pre.firstElementChild?.tagName).toBe('CODE');
  expect(getComputedStyle(pre).whiteSpace).toBe(wrap ? 'pre-wrap' : 'pre');
  pre.remove();
});
