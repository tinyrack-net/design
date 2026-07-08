import './theme.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

const themeDatasetKey = 'theme';

function DaisyPreview() {
  return (
    <div data-testid="surface" className="bg-base-100 text-base-content">
      <button className="btn btn-primary" type="button">
        Primary
      </button>
    </div>
  );
}

test('tinyrack daisyUI css exposes light and dark theme variables', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  const screen = await render(<DaisyPreview />);

  await expect.element(screen.getByText('Primary')).toBeVisible();
  expect(
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
  ).toBe('#171717');

  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  expect(
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
  ).toBe('#fafafa');
});
