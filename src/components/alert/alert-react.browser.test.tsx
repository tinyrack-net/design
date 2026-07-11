import '../../core/core.css';
import './alert.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { alertVariants } from './contract.js';
import { Alert } from './react.js';

test.each(
  alertVariants,
)('React Alert renders variant %s and native props', async (variant) => {
  const screen = await render(
    <Alert aria-live="polite" className="consumer" variant={variant}>
      Status
    </Alert>,
  );
  const alert = screen.getByText('Status').element();
  expect(alert).toHaveClass('tr-alert', 'consumer');
  expect(alert).toHaveAttribute('data-variant', variant);
  expect(alert).toHaveAttribute('aria-live', 'polite');
});
