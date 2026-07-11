import '../../core/core.css';
import './link.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import { linkUnderlines, linkVariants } from './contract.js';

const cases = linkVariants.flatMap((variant) =>
  linkUnderlines.map((underline) => [variant, underline] as const),
);

test.each(cases)('raw Link supports %s/%s', (variant, underline) => {
  const link = createRawElement('a', {
    attributes: { href: '#rack' },
    className: 'tr-link',
    data: { underline, variant },
    text: 'Rack',
  });
  expect(link).toHaveAttribute('href', '#rack');
  expect(link.dataset).toMatchObject({ underline, variant });
  link.remove();
});
