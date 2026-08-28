import '../../core/core.css';
import './provider-mark.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRProviderMark } from './index.js';

test('renders reviewed provider artwork and preserves image props', async () => {
  const ref = createRef<SVGSVGElement>();
  await render(
    <TRProviderMark
      aria-label="Google"
      className="consumer-mark"
      data-testid="provider-mark"
      provider="google"
      ref={ref}
    />,
  );
  const mark = page.getByTestId('provider-mark').element();
  expect(mark).toBe(ref.current);
  expect(mark).toHaveClass('tr-provider-mark', 'consumer-mark');
  expect(mark).toHaveAttribute('data-provider', 'google');
  expect(mark).toHaveAttribute('aria-label', 'Google');
  expect(mark).toHaveAttribute('role', 'img');
  expect(mark.querySelectorAll('path')).toHaveLength(4);
  expect(getComputedStyle(mark).width).toBe('24px');
});

test.each(['github', 'apple'] as const)(
  'renders the %s mark as decorative by default',
  async (provider) => {
    const testId = `${provider}-mark`;
    await render(<TRProviderMark data-testid={testId} provider={provider} />);

    const mark = page.getByTestId(testId).element();
    expect(mark).toHaveAttribute('data-provider', provider);
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(mark).not.toHaveAttribute('role');
    expect(mark.querySelectorAll('path')).toHaveLength(1);
  },
);
