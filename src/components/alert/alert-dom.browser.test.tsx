import '../../core/core.css';
import './alert.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import { alertVariants } from './contract.js';

test.each(alertVariants)('raw Alert exposes variant %s', (variant) => {
  const alert = createRawElement('div', {
    className: 'tr-alert',
    data: { variant },
    text: 'Status',
  });
  expect(alert.dataset['variant']).toBe(variant);
  expect(getComputedStyle(alert).display).not.toBe('none');
  alert.remove();
});
