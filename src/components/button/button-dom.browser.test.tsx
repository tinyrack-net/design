import '../../core/core.css';
import '../spinner/spinner.css';
import './button.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import {
  buttonAppearances,
  buttonGroupOrientations,
  buttonSizes,
  buttonVariants,
} from './contract.js';

const buttonCases = buttonSizes.flatMap((size) =>
  buttonVariants.flatMap((variant) =>
    buttonAppearances.map((appearance) => [size, variant, appearance] as const),
  ),
);

test.each(buttonCases)('raw Button supports %s/%s/%s', (size, variant, appearance) => {
  const button = createRawElement('button', {
    attributes: { type: 'button' },
    className: 'tr-btn',
    data: { appearance, size, variant },
    text: 'Save',
  });
  expect(button.dataset).toMatchObject({ appearance, size, variant });
  expect(button.type).toBe('button');
  expect(getComputedStyle(button).display).toBe('inline-flex');
  button.remove();
});

test.each(
  buttonGroupOrientations,
)('raw ButtonGroup exposes %s grouping', (orientation) => {
  const group = createRawElement('div', {
    attributes: { role: 'group' },
    className: 'tr-btn-group',
    data: { attached: 'true', orientation },
  });
  expect(group).toHaveAttribute('role', 'group');
  group.remove();
});
