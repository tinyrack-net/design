import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { dividerOrientations } from './contract.js';
import { Divider } from './react.js';

test.each(
  dividerOrientations,
)('Divider DOM/React parity for %s', async (orientation) => {
  const raw = createRawElement('hr', {
    attributes: {
      'aria-orientation': orientation === 'vertical' ? 'vertical' : undefined,
    },
    className: 'tr-divider',
    data: { orientation },
  });
  const rendered = await render(<Divider orientation={orientation} />);
  expectElementParity(raw, rendered.container.querySelector('hr')!);
  raw.remove();
});
