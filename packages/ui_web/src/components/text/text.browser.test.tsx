import '../../core/core.css';
import './text.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRText, type TRTextVariant } from './index.js';

test('preserves defaults, native props, events, refs, and consumer tokens', async () => {
  const ref = createRef<HTMLSpanElement>();
  const onClick = vi.fn();

  await render(
    <TRText
      aria-label="status"
      className="consumer-text"
      data-testid="status"
      onClick={onClick}
      ref={ref}
      style={{ '--tr-text-font-size': '18px' } as React.CSSProperties}
    >
      Ready
    </TRText>,
  );

  ref.current?.click();
  expect(onClick).toHaveBeenCalledOnce();
  expect(ref.current).toHaveClass('tr-text', 'consumer-text');
  expect(ref.current?.tagName).toBe('SPAN');
  expect(ref.current?.dataset['variant']).toBe('body');
  expect(ref.current?.getAttribute('aria-label')).toBe('status');
  expect(getComputedStyle(ref.current as HTMLElement).fontSize).toBe('18px');
});

test('maps every documented variant to distinct heading/body typography in both themes', async () => {
  const themes = ['tinyrack-light', 'tinyrack-dark'] as const;
  const variants: TRTextVariant[] = [
    'caption',
    'label',
    'body',
    'bodySm',
    'code',
    'headingSm',
    'headingMd',
    'headingLg',
    'display',
    'displayLg',
  ];
  const headingVariants = new Set<TRTextVariant>([
    'headingSm',
    'headingMd',
    'headingLg',
    'display',
    'displayLg',
  ]);
  const entries = themes.flatMap((theme) =>
    variants.map((variant) => ({
      ref: createRef<HTMLSpanElement>(),
      theme,
      variant,
    })),
  );

  await render(
    themes.map((theme) => (
      <div data-theme={theme} key={theme}>
        {entries
          .filter((entry) => entry.theme === theme)
          .map(({ ref, variant }) => (
            <TRText key={variant} ref={ref} variant={variant}>
              {variant}
            </TRText>
          ))}
      </div>
    )),
  );

  for (const { ref, variant } of entries) {
    const element = ref.current as HTMLElement;
    expect(element.dataset['variant']).toBe(variant);
    const style = getComputedStyle(element);
    expect(Number.parseFloat(style.fontSize)).toBeGreaterThan(0);
    // Heading roles are heavier than the regular (400) body weight.
    if (headingVariants.has(variant)) {
      expect(Number.parseInt(style.fontWeight, 10)).toBeGreaterThan(400);
    }
  }

  // The display role must render larger than the body role.
  const bodySize = Number.parseFloat(
    getComputedStyle(
      entries.find((e) => e.theme === 'tinyrack-light' && e.variant === 'body')?.ref
        .current as HTMLElement,
    ).fontSize,
  );
  const displaySize = Number.parseFloat(
    getComputedStyle(
      entries.find((e) => e.theme === 'tinyrack-light' && e.variant === 'display')?.ref
        .current as HTMLElement,
    ).fontSize,
  );
  expect(displaySize).toBeGreaterThan(bodySize);
  const displayLgSize = Number.parseFloat(
    getComputedStyle(
      entries.find((e) => e.theme === 'tinyrack-light' && e.variant === 'displayLg')
        ?.ref.current as HTMLElement,
    ).fontSize,
  );
  expect(displayLgSize).toBeGreaterThan(displaySize);
});

test('renders the requested element via the as prop', async () => {
  const headingRef = createRef<HTMLHeadingElement>();
  const paragraphRef = createRef<HTMLParagraphElement>();

  await render(
    <>
      <TRText as="h1" ref={headingRef} variant="display">
        Cluster health
      </TRText>
      <TRText as="p" ref={paragraphRef} variant="body">
        All nodes are available.
      </TRText>
    </>,
  );

  expect(headingRef.current?.tagName).toBe('H1');
  expect(headingRef.current).toHaveClass('tr-text');
  expect(headingRef.current?.dataset['variant']).toBe('display');
  expect(paragraphRef.current?.tagName).toBe('P');
});

test('applies color, align, truncate, and weight overrides', async () => {
  const inheritRef = createRef<HTMLSpanElement>();
  const mutedRef = createRef<HTMLSpanElement>();
  const truncateRef = createRef<HTMLSpanElement>();
  const weightRef = createRef<HTMLSpanElement>();

  await render(
    <div data-theme="tinyrack-light" style={{ color: 'rgb(1, 2, 3)' }}>
      <TRText ref={inheritRef}>inherits</TRText>
      <TRText color="muted" ref={mutedRef}>
        muted
      </TRText>
      <TRText align="center" ref={truncateRef} truncate variant="bodySm">
        a very long single line of text that should be clamped
      </TRText>
      <TRText ref={weightRef} variant="body" weight="strong">
        strong
      </TRText>
    </div>,
  );

  // No color prop: inherits the parent color instead of forcing a token.
  expect(inheritRef.current?.dataset['color']).toBeUndefined();
  expect(getComputedStyle(inheritRef.current as HTMLElement).color).toBe(
    'rgb(1, 2, 3)',
  );

  // Muted color maps to the muted text token (distinct from inherited color).
  expect(mutedRef.current?.dataset['color']).toBe('muted');
  expect(getComputedStyle(mutedRef.current as HTMLElement).color).not.toBe(
    'rgb(1, 2, 3)',
  );

  const truncateStyle = getComputedStyle(truncateRef.current as HTMLElement);
  expect(truncateStyle.textAlign).toBe('center');
  expect(truncateStyle.whiteSpace).toBe('nowrap');
  expect(truncateStyle.textOverflow).toBe('ellipsis');

  // weight="strong" (700) overrides the body variant's regular (400) weight.
  expect(getComputedStyle(weightRef.current as HTMLElement).fontWeight).toBe('700');
});
