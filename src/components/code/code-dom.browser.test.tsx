import '../../core/core.css';
import './code.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';

test('raw Code uses native inline code semantics', () => {
  const code = createRawElement('code', {
    className: 'tr-code consumer',
    text: 'pnpm verify',
  });
  expect(code.tagName).toBe('CODE');
  expect(getComputedStyle(code).fontFamily).not.toBe('');
  code.remove();
});
