import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { linkUnderlines, linkVariants } from './contract.js';
import { Link } from './react.js';

const cases = linkVariants.flatMap((variant) =>
  linkUnderlines.map((underline) => [variant, underline] as const),
);

test.each(cases)('Link DOM/React parity for %s/%s', async (variant, underline) => {
  const raw = createRawElement('a', {
    attributes: { href: '#rack' },
    className: 'tr-link',
    data: { underline, variant },
    text: 'Rack',
  });
  const rendered = await render(
    <Link href="#rack" underline={underline} variant={variant}>
      Rack
    </Link>,
  );
  expectElementParity(raw, rendered.container.querySelector('.tr-link')!);
  raw.remove();
});
