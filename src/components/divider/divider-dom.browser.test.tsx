import '../../core/core.css';
import './divider.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import { dividerOrientations } from './contract.js';

test.each(dividerOrientations)('raw Divider supports %s', (orientation) => {
  const divider = createRawElement('hr', {
    attributes: {
      'aria-orientation': orientation === 'vertical' ? 'vertical' : undefined,
    },
    className: 'tr-divider',
    data: { orientation },
  });
  expect(divider.dataset['orientation']).toBe(orientation);
  expect(divider.getAttribute('aria-orientation')).toBe(
    orientation === 'vertical' ? 'vertical' : null,
  );
  divider.remove();
});
