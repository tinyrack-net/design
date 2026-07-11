import '../../core/core.css';
import './avatar.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import { avatarShapes, avatarSizes } from './contract.js';

const cases = avatarSizes.flatMap((size) =>
  avatarShapes.map((shape) => [size, shape] as const),
);

test.each(cases)('raw Avatar supports %s/%s', (size, shape) => {
  const avatar = createRawElement('span', {
    className: 'tr-avatar',
    data: { shape, size },
    text: 'TR',
  });
  expect(avatar.dataset).toMatchObject({ shape, size });
  expect(Number.parseFloat(getComputedStyle(avatar).width)).toBeGreaterThan(0);
  avatar.remove();
});
