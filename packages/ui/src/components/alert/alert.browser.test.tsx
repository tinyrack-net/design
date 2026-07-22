import '../../core/core.css';
import '../button/button.css';
import './alert.css';
import { createRef } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRButton } from '../button/index.js';
import { TRAlert, TRAlertRoot } from './index.js';

function relativeLuminance(color: string) {
  const channels = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  const [red = 0, green = 0, blue = 0] = channels.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

afterEach(() => {
  delete document.documentElement.dataset['theme'];
});

test('assembles all alert parts in index.tsx', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  expect(TRAlert.Root).toBe(TRAlertRoot);
  await render(
    <TRAlert.Root data-testid="alert" variant="warning">
      <TRAlert.Title>Attention</TRAlert.Title>
      <TRAlert.Description>Review this change.</TRAlert.Description>
      <TRAlert.Actions>
        <button type="button">Review</button>
      </TRAlert.Actions>
    </TRAlert.Root>,
  );

  const root = document.querySelector<HTMLElement>('[data-testid="alert"]');
  expect(root?.dataset['variant']).toBe('warning');
  const title = root?.querySelector<HTMLElement>('.tr-alert-title');
  const actions = root?.querySelector<HTMLElement>('.tr-alert-actions');
  expect(title?.textContent).toBe('Attention');
  expect(getComputedStyle(title as HTMLElement).fontWeight).not.toBe('400');
  expect(getComputedStyle(actions as HTMLElement).display).toBe('flex');
  expect(getComputedStyle(actions as HTMLElement).flexWrap).toBe('wrap');
});

test('forwards an application-selected announcement role', async () => {
  await render(
    <div>
      <TRAlert.Root data-testid="polite" role="status" variant="success">
        <TRAlert.Title>Backup complete</TRAlert.Title>
      </TRAlert.Root>
      <TRAlert.Root data-testid="urgent" role="alert" variant="danger">
        <TRAlert.Title>Connection lost</TRAlert.Title>
      </TRAlert.Root>
    </div>,
  );
  expect(document.querySelector('[data-testid="polite"]')?.getAttribute('role')).toBe(
    'status',
  );
  expect(document.querySelector('[data-testid="urgent"]')?.getAttribute('role')).toBe(
    'alert',
  );
});

test('preserves native props, events, refs, classes, and consumer tokens', async () => {
  const rootRef = createRef<HTMLDivElement>();
  const actionsRef = createRef<HTMLDivElement>();
  const onClick = vi.fn();

  await render(
    <TRAlert.Root
      aria-label="Deployment status"
      className="consumer-alert"
      data-testid="custom-alert"
      onClick={onClick}
      ref={rootRef}
      style={{ '--tr-alert-background': 'rgb(1, 2, 3)' } as React.CSSProperties}
    >
      <TRAlert.Actions className="consumer-actions" ref={actionsRef} />
    </TRAlert.Root>,
  );

  rootRef.current?.click();
  expect(onClick).toHaveBeenCalledOnce();
  expect(rootRef.current).toHaveClass('tr-alert', 'consumer-alert');
  expect(rootRef.current?.dataset['variant']).toBe('neutral');
  expect(rootRef.current?.getAttribute('aria-label')).toBe('Deployment status');
  expect(getComputedStyle(rootRef.current as HTMLElement).backgroundColor).toBe(
    'rgb(1, 2, 3)',
  );
  expect(actionsRef.current).toHaveClass('tr-alert-actions', 'consumer-actions');
});

test('styles every status variant through stable data attributes', async () => {
  const variants = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
  const expectedBackgrounds = {
    'tinyrack-dark': {
      danger: 'rgb(51, 34, 34)',
      info: 'rgb(38, 45, 52)',
      neutral: 'rgb(23, 23, 23)',
      success: 'rgb(37, 50, 42)',
      warning: 'rgb(52, 46, 30)',
    },
    'tinyrack-light': {
      danger: 'rgb(254, 242, 242)',
      info: 'rgb(239, 246, 255)',
      neutral: 'rgb(245, 245, 245)',
      success: 'rgb(240, 253, 244)',
      warning: 'rgb(255, 251, 235)',
    },
  } as const;
  document.documentElement.dataset['theme'] = 'tinyrack-light';

  await render(
    variants.map((variant) => (
      <TRAlert.Root data-testid={variant} key={variant} variant={variant}>
        <TRAlert.Title>{variant}</TRAlert.Title>
      </TRAlert.Root>
    )),
  );

  for (const variant of variants) {
    const alert = document.querySelector<HTMLElement>(`[data-testid="${variant}"]`);
    const styles = getComputedStyle(alert as HTMLElement);
    expect(alert?.dataset['variant']).toBe(variant);
    expect(styles.backgroundColor).toBe(expectedBackgrounds['tinyrack-light'][variant]);
    expect(styles.borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
  }

  document.documentElement.dataset['theme'] = 'tinyrack-dark';
  for (const variant of variants) {
    const alert = document.querySelector<HTMLElement>(`[data-testid="${variant}"]`);
    const styles = getComputedStyle(alert as HTMLElement);
    expect(styles.backgroundColor).toBe(expectedBackgrounds['tinyrack-dark'][variant]);
    expect(styles.borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
  }
});

test.each([
  [
    'tinyrack-light',
    {
      danger: ['rgb(185, 28, 28)', 'rgb(220, 38, 38)', 'rgb(254, 226, 226)'],
      info: ['rgb(29, 78, 216)', 'rgb(37, 99, 235)', 'rgb(219, 234, 254)'],
      neutral: ['rgb(82, 82, 82)', 'rgb(115, 115, 115)', 'rgb(229, 229, 229)'],
      success: ['rgb(21, 128, 61)', 'rgb(22, 163, 74)', 'rgb(220, 252, 231)'],
      warning: ['rgb(146, 64, 14)', 'rgb(217, 119, 6)', 'rgb(254, 243, 199)'],
    },
  ],
  [
    'tinyrack-dark',
    {
      danger: ['rgb(248, 113, 113)', 'rgb(248, 113, 113)', 'rgb(127, 29, 29)'],
      info: ['rgb(147, 197, 253)', 'rgb(96, 165, 250)', 'rgb(30, 58, 138)'],
      neutral: ['rgb(163, 163, 163)', 'rgb(163, 163, 163)', 'rgb(38, 38, 38)'],
      success: ['rgb(134, 239, 172)', 'rgb(74, 222, 128)', 'rgb(20, 83, 45)'],
      warning: ['rgb(252, 211, 77)', 'rgb(251, 191, 36)', 'rgb(120, 53, 15)'],
    },
  ],
] as const)('gives every alert action a matching semantic resting and hover state in %s', async (theme, expectedColors) => {
  document.documentElement.dataset['theme'] = theme;
  const variants = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
  const screen = await render(
    variants.map((variant) => (
      <TRAlert.Root key={variant} variant={variant}>
        <TRAlert.Title>{variant}</TRAlert.Title>
        <TRAlert.Description>{variant} details</TRAlert.Description>
        <TRAlert.Actions>
          <TRButton appearance="outline" intent={variant}>
            {variant} action
          </TRButton>
        </TRAlert.Actions>
      </TRAlert.Root>
    )),
  );

  for (const variant of variants) {
    const button = screen.getByRole('button', { name: `${variant} action` });
    const alert = button.element().closest<HTMLElement>('.tr-alert');
    const title = alert?.querySelector<HTMLElement>('.tr-alert-title');
    const description = alert?.querySelector<HTMLElement>('.tr-alert-description');
    const [color, border, hover] = expectedColors[variant];
    const restingStyles = getComputedStyle(button.element());
    const alertStyles = getComputedStyle(alert as HTMLElement);
    expect(restingStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(restingStyles.color).toBe(color);
    expect(restingStyles.borderColor).toBe(border);
    expect(
      contrastRatio(
        getComputedStyle(title as HTMLElement).color,
        alertStyles.backgroundColor,
      ),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(
        getComputedStyle(description as HTMLElement).color,
        alertStyles.backgroundColor,
      ),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(restingStyles.color, alertStyles.backgroundColor),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(alertStyles.borderTopColor, alertStyles.backgroundColor),
    ).toBeGreaterThanOrEqual(3);

    await userEvent.hover(button);
    await expect
      .poll(() => getComputedStyle(button.element()).backgroundColor)
      .toBe(hover);
    await userEvent.unhover(button);
  }
});

test('uses a neutral title by default and supports a contextual heading', async () => {
  const titleRef = createRef<HTMLHeadingElement>();
  const descriptionRef = createRef<HTMLDivElement>();

  await render(
    <>
      <TRAlert.Root>
        <TRAlert.Title>Neutral title</TRAlert.Title>
      </TRAlert.Root>
      <TRAlert.Root>
        <TRAlert.Title ref={titleRef} render={<h4>Contextual title</h4>} />
        <TRAlert.Description
          ref={descriptionRef}
          render={<div>Contextual details</div>}
        />
      </TRAlert.Root>
    </>,
  );

  expect(document.querySelector('.tr-alert-title')?.tagName).toBe('DIV');
  expect(document.querySelector('h4.tr-alert-title')?.textContent).toBe(
    'Contextual title',
  );
  expect(titleRef.current?.tagName).toBe('H4');
  expect(descriptionRef.current).toHaveClass('tr-alert-description');
  expect(descriptionRef.current?.textContent).toBe('Contextual details');
});

test('contains an unbroken status message at narrow widths', async () => {
  await render(
    <div style={{ width: 160 }}>
      <TRAlert.Root data-testid="narrow-alert" variant="danger">
        <TRAlert.Title>Deployment failed</TRAlert.Title>
        <TRAlert.Description>
          deployment-01JYV7ZVN5J5FD4XR3MZXQ8T2A.example.internal
        </TRAlert.Description>
      </TRAlert.Root>
    </div>,
  );

  const alert = document.querySelector<HTMLElement>('[data-testid="narrow-alert"]');
  expect((alert as HTMLElement).scrollWidth).toBeLessThanOrEqual(
    (alert as HTMLElement).clientWidth,
  );
});
