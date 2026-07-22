import '../../core/core.css';
import './alert.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRAlert, TRAlertRoot } from './index.js';

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
  document.documentElement.dataset['theme'] = 'tinyrack-light';

  await render(
    variants.map((variant) => (
      <TRAlert.Root data-testid={variant} key={variant} variant={variant}>
        <TRAlert.Title>{variant}</TRAlert.Title>
      </TRAlert.Root>
    )),
  );

  const lightBackgrounds = new Map<string, string>();
  for (const variant of variants) {
    const alert = document.querySelector<HTMLElement>(`[data-testid="${variant}"]`);
    const styles = getComputedStyle(alert as HTMLElement);
    expect(alert?.dataset['variant']).toBe(variant);
    expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
    lightBackgrounds.set(variant, styles.backgroundColor);
  }

  document.documentElement.dataset['theme'] = 'tinyrack-dark';
  for (const variant of variants) {
    const alert = document.querySelector<HTMLElement>(`[data-testid="${variant}"]`);
    const styles = getComputedStyle(alert as HTMLElement);
    expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.backgroundColor).not.toBe(lightBackgrounds.get(variant));
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
