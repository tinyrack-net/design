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
  expect(ref.current?.tagName).toBe('SPAN');
  expect(ref.current?.getAttribute('role')).toBeNull();
  expect(ref.current?.dataset['uiSize']).toBe('md');
  expect(ref.current?.dataset['variant']).toBe('neutral');
  expect(ref.current?.getAttribute('aria-live')).toBe('polite');
  expect(getComputedStyle(ref.current as HTMLElement).display).toBe('inline-flex');
  expect(getComputedStyle(ref.current as HTMLElement).fontSize).toBe('18px');
});

test('maps every documented size and status variant to stable data attributes', async () => {
  const themes = ['tinyrack-light', 'tinyrack-dark'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;
  const variants = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
  const badges = themes.flatMap((theme) =>
    sizes.flatMap((size) =>
      variants.map((variant) => ({
        ref: createRef<HTMLSpanElement>(),
        size,
        theme,
        variant,
      })),
    ),
  );
  const backgrounds = new Map<string, string>();
  const dimensions = new Map<string, { fontSize: number; height: number }>();

  await render(
    themes.map((theme) => (
      <div data-theme={theme} key={theme}>
        {badges
          .filter((badge) => badge.theme === theme)
          .map(({ ref, size, variant }) => (
            <TRBadge
              data-testid={`${theme}-${size}-${variant}`}
              key={`${size}-${variant}`}
              ref={ref}
              uiSize={size}
              variant={variant}
            >
              {variant}
            </TRBadge>
          ))}
      </div>
    )),
  );

  for (const { ref, size, theme, variant } of badges) {
    const badge = ref.current;
    expect(badge?.dataset['uiSize']).toBe(size);
    expect(badge?.dataset['variant']).toBe(variant);
    const style = getComputedStyle(badge as HTMLElement);
    expect(style.display).toBe('inline-flex');
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(style.borderColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(style.color).not.toBe('rgba(0, 0, 0, 0)');
    backgrounds.set(`${theme}-${variant}`, style.backgroundColor);
    dimensions.set(`${theme}-${size}-${variant}`, {
      fontSize: Number.parseFloat(style.fontSize),
      height: (badge as HTMLElement).getBoundingClientRect().height,
    });
  }

  for (const theme of themes) {
    for (const variant of variants) {
      const small = dimensions.get(`${theme}-sm-${variant}`);
      const medium = dimensions.get(`${theme}-md-${variant}`);
      const large = dimensions.get(`${theme}-lg-${variant}`);
      expect(small?.fontSize).toBeLessThan(medium?.fontSize ?? 0);
      expect(medium?.fontSize).toBeLessThan(large?.fontSize ?? 0);
      expect(small?.height).toBeLessThan(medium?.height ?? 0);
      expect(medium?.height).toBeLessThan(large?.height ?? 0);
    }
  }

  for (const variant of variants) {
    expect(backgrounds.get(`tinyrack-light-${variant}`)).not.toBe(
      backgrounds.get(`tinyrack-dark-${variant}`),
    );
  }
});

test('keeps an icon aligned while wrapping a long status label inside a narrow parent', async () => {
  const badgeRef = createRef<HTMLSpanElement>();
  const iconRef = createRef<SVGSVGElement>();
  await render(
    <div style={{ width: 160 }}>
      <TRBadge data-testid="long-badge" ref={badgeRef}>
        <svg
          aria-hidden="true"
          data-testid="icon"
          height="1em"
          ref={iconRef}
          viewBox="0 0 16 16"
          width="1em"
        >
          <circle cx="8" cy="8" r="6" />
        </svg>
        Waiting for maintenance approval from operator
      </TRBadge>
    </div>,
  );
  expect(getComputedStyle(badgeRef.current as HTMLElement).display).toBe('inline-flex');
  expect((badgeRef.current as HTMLElement).scrollWidth).toBeLessThanOrEqual(
    (badgeRef.current as HTMLElement).clientWidth,
  );
  expect(getComputedStyle(badgeRef.current as HTMLElement).whiteSpace).toBe('normal');
  expect(getComputedStyle(iconRef.current as SVGElement).flexShrink).toBe('0');
});
