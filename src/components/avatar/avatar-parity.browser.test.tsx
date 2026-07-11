import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { avatarShapes, avatarSizes } from './contract.js';
import { Avatar } from './react.js';

const cases = avatarSizes.flatMap((size) =>
  avatarShapes.map((shape) => [size, shape] as const),
);

test.each(cases)('Avatar DOM/React parity for %s/%s', async (size, shape) => {
  const raw = createRawElement('span', {
    className: 'tr-avatar',
    data: { shape, size },
    text: 'TR',
  });
  const rendered = await render(
    <Avatar shape={shape} size={size}>
      TR
    </Avatar>,
  );
  expectElementParity(raw, rendered.container.querySelector('.tr-avatar')!);
  raw.remove();
});
