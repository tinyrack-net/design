import '../../core/core.css';
import './link.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { linkUnderlines, linkVariants } from './contract.js';
import { Link } from './react.js';

const cases = linkVariants.flatMap((variant) =>
  linkUnderlines.map((underline) => [variant, underline] as const),
);

test.each(cases)('React Link supports %s/%s', async (variant, underline) => {
  const screen = await render(
    <Link href="#rack" underline={underline} variant={variant}>
      Rack
    </Link>,
  );
  const link = screen.getByRole('link').element();
  expect(link).toHaveAttribute('href', '#rack');
  expect(link).toHaveAttribute('data-underline', underline);
  expect(link).toHaveAttribute('data-variant', variant);
});
