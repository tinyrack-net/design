import '../../core/core.css';
import './avatar.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { avatarShapes, avatarSizes } from './contract.js';
import { Avatar } from './react.js';

const cases = avatarSizes.flatMap((size) =>
  avatarShapes.map((shape) => [size, shape] as const),
);

test.each(cases)('React Avatar supports %s/%s', async (size, shape) => {
  const screen = await render(
    <Avatar aria-label="Tinyrack" shape={shape} size={size}>
      TR
    </Avatar>,
  );
  const avatar = screen.getByLabelText('Tinyrack').element();
  expect(avatar).toHaveAttribute('data-size', size);
  expect(avatar).toHaveAttribute('data-shape', shape);
});
