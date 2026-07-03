import '../../../test/fixtures/tailwind-daisyui-fixture.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

function TailwindDaisyPreview() {
  return (
    <div
      data-testid="tailwind-surface"
      className="rounded-tinyrack-box bg-tinyrack-surface text-tinyrack-primary font-tinyrack-body"
    >
      <button className="btn btn-primary" type="button">
        Tailwind + daisyUI
      </button>
    </div>
  );
}

test('tailwind plus daisyUI composition exposes Tinyrack utilities and daisyUI theme', async () => {
  document.documentElement.dataset.theme = 'tinyrack-dark';
  const screen = await render(<TailwindDaisyPreview />);

  await expect.element(screen.getByText('Tailwind + daisyUI')).toBeVisible();

  const surface = document.querySelector('[data-testid="tailwind-surface"]');
  const styles = getComputedStyle(surface as Element);

  expect(styles.backgroundColor).toBe('rgb(10, 10, 10)');
  expect(styles.color).toBe('rgb(250, 250, 250)');
  expect(styles.borderRadius).toBe('8px');
  expect(
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
  ).toBe('#fafafa');
});
