import '../../core/core.css';
import './divider.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { dividerOrientations } from './contract.js';
import { Divider } from './react.js';

test.each(dividerOrientations)('React Divider supports %s', async (orientation) => {
  const screen = await render(
    <Divider aria-label="Section" orientation={orientation} />,
  );
  const divider = screen.getByRole('separator').element();
  expect(divider).toHaveAttribute('data-orientation', orientation);
  expect(divider.getAttribute('aria-orientation')).toBe(
    orientation === 'vertical' ? 'vertical' : null,
  );
});
