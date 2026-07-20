import '../../core/core.css';
import './badge.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRBadge } from './index.js';

test('preserves defaults, native props, events, refs, and consumer tokens', async () => {
  const ref = createRef<HTMLSpanElement>();
  const onClick = vi.fn();

  await render(
    <TRBadge
      aria-live="polite"
      className="consumer-badge"
      data-testid="status"
      onClick={onClick}
      ref={ref}
      style={{ '--tr-badge-font-size': '18px' } as React.CSSProperties}
    >
      Ready
    </TRBadge>,
  );

  ref.current?.click();
  expect(onClick).toHaveBeenCalledOnce();
  expect(ref.current).toHaveClass('tr-badge', 'consumer-badge');
  expect(ref.current?.dataset['uiSize']).toBe('md');
  expect(ref.current?.dataset['variant']).toBe('neutral');
  expect(ref.current?.getAttribute('aria-live')).toBe('polite');
  expect(getComputedStyle(ref.current as HTMLElement).fontSize).toBe('18px');
});

test('maps every documented size and status variant to stable data attributes', async () => {
  const sizes = ['sm', 'md', 'lg'] as const;
  const variants = ['neutral', 'info', 'success', 'warning', 'danger'] as const;

  await render(
    sizes.flatMap((size) =>
      variants.map((variant) => (
        <TRBadge
          data-testid={`${size}-${variant}`}
          key={`${size}-${variant}`}
          uiSize={size}
          variant={variant}
        >
          {variant}
        </TRBadge>
      )),
    ),
  );

  for (const size of sizes) {
    for (const variant of variants) {
      const badge = document.querySelector<HTMLElement>(
        `[data-testid="${size}-${variant}"]`,
      );
      expect(badge?.dataset['uiSize']).toBe(size);
      expect(badge?.dataset['variant']).toBe(variant);
      expect(getComputedStyle(badge as HTMLElement).color).not.toBe('rgba(0, 0, 0, 0)');
    }
  }
});

test('wraps a long status label inside a narrow parent', async () => {
  await render(
    <div style={{ width: 160 }}>
      <TRBadge data-testid="long-badge">
        Waiting for maintenance approval from operator
      </TRBadge>
    </div>,
  );
  const badge = document.querySelector<HTMLElement>('[data-testid="long-badge"]');
  expect((badge as HTMLElement).scrollWidth).toBeLessThanOrEqual(
    (badge as HTMLElement).clientWidth,
  );
  expect(getComputedStyle(badge as HTMLElement).whiteSpace).toBe('normal');
});
