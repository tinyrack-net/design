import '../../core/core.css';
import './spinner.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { spinnerSizes, spinnerVariants } from './contract.js';
import { Spinner } from './react.js';

const cases = spinnerSizes.flatMap((size) =>
  spinnerVariants.map((variant) => [size, variant] as const),
);

test.each(
  cases,
)('React Spinner supports %s/%s accessible states', async (size, variant) => {
  const decorative = await render(<Spinner size={size} variant={variant} />);
  expect(decorative.container.querySelector('.tr-spinner')).toHaveAttribute(
    'role',
    'presentation',
  );
  const labeled = await render(
    <Spinner aria-label="Loading" className="consumer" size={size} variant={variant} />,
  );
  expect(labeled.getByRole('status').element()).toHaveClass('tr-spinner', 'consumer');
});
