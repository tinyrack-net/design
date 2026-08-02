import '../../core/core.css';
import './progress.css';
import { act, type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, expectTypeOf, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRProgress, TRProgressRoot, type TRProgressStatus } from './index.js';

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

test('assembles an accessible progress indicator', async () => {
  expect(TRProgress.Root).toBe(TRProgressRoot);
  await render(
    <TRProgress.Root uiSize="lg" value={65} variant="success">
      <TRProgress.Label>Deploy</TRProgress.Label>
      <TRProgress.Track>
        <TRProgress.Indicator />
      </TRProgress.Track>
      <TRProgress.Value />
    </TRProgress.Root>,
  );
  const root = document.querySelector<HTMLElement>('.tr-progress');
  expect(root?.getAttribute('role')).toBe('progressbar');
  expect(root?.getAttribute('aria-valuenow')).toBe('65');
  expect(root?.dataset['variant']).toBe('success');
  expect(page.getByRole('progressbar', { name: 'Deploy' }).element()).toBe(root);
});

test('exports the complete progress status contract', () => {
  expectTypeOf<TRProgressStatus>().toEqualTypeOf<
    'indeterminate' | 'progressing' | 'complete'
  >();
});

test('supports custom ranges, formatting, and accessible value text', async () => {
  await render(
    <TRProgress.Root
      format={{ maximumFractionDigits: 0, style: 'unit', unit: 'gigabyte' }}
      getAriaValueText={(formattedValue) => `${formattedValue} of 64 used`}
      locale="en"
      max={64}
      min={16}
      value={40}
    >
      <TRProgress.Label>Image cache</TRProgress.Label>
      <TRProgress.Value />
      <TRProgress.Track>
        <TRProgress.Indicator />
      </TRProgress.Track>
    </TRProgress.Root>,
  );

  const root = document.querySelector<HTMLElement>('.tr-progress');
  const indicator = document.querySelector<HTMLElement>('.tr-progress-indicator');
  expect(root?.getAttribute('aria-valuemin')).toBe('16');
  expect(root?.getAttribute('aria-valuemax')).toBe('64');
  expect(root?.getAttribute('aria-valuenow')).toBe('40');
  expect(root?.getAttribute('aria-valuetext')).toBe('40 GB of 64 used');
  expect(document.querySelector('.tr-progress-value')?.textContent).toBe('40 GB');
  expect(indicator?.style.width).toBe('50%');
});

test('preserves refs, native props, render props, and consumer classes', async () => {
  const rootRef = createRef<HTMLDivElement>();
  const labelRef = createRef<HTMLSpanElement>();
  const trackRef = createRef<HTMLDivElement>();
  const indicatorRef = createRef<HTMLDivElement>();
  const valueRef = createRef<HTMLSpanElement>();

  await render(
    <TRProgress.Root
      className={({ status }) => `consumer-${status}`}
      data-native="root"
      ref={rootRef}
      render={<section />}
      value={50}
    >
      <TRProgress.Label ref={labelRef}>Upload</TRProgress.Label>
      <TRProgress.Value ref={valueRef} />
      <TRProgress.Track ref={trackRef} title="Upload track">
        <TRProgress.Indicator ref={indicatorRef} />
      </TRProgress.Track>
    </TRProgress.Root>,
  );

  expect(rootRef.current?.tagName).toBe('SECTION');
  expect(rootRef.current?.classList.contains('tr-progress')).toBe(true);
  expect(rootRef.current?.classList.contains('consumer-progressing')).toBe(true);
  expect(rootRef.current?.dataset['native']).toBe('root');
  expect(labelRef.current?.classList.contains('tr-progress-label')).toBe(true);
  expect(trackRef.current?.title).toBe('Upload track');
  expect(indicatorRef.current?.classList.contains('tr-progress-indicator')).toBe(true);
  expect(valueRef.current?.classList.contains('tr-progress-value')).toBe(true);
});

test('applies every size, semantic variant, and customization token', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const sizes = ['sm', 'md', 'lg'] as const;
  const variants = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
  await render(
    <div>
      {sizes.map((uiSize) => (
        <TRProgress.Root aria-label={uiSize} key={uiSize} uiSize={uiSize} value={50}>
          <TRProgress.Track>
            <TRProgress.Indicator />
          </TRProgress.Track>
        </TRProgress.Root>
      ))}
      {variants.map((variant) => (
        <TRProgress.Root
          aria-label={variant}
          key={variant}
          value={50}
          variant={variant}
        >
          <TRProgress.Track>
            <TRProgress.Indicator />
          </TRProgress.Track>
        </TRProgress.Root>
      ))}
      <TRProgress.Root aria-label="custom" value={50}>
        <TRProgress.Track
          style={
            {
              '--tr-progress-background': 'rgb(1, 2, 3)',
              '--tr-progress-height': '17px',
              '--tr-progress-radius': '3px',
            } as CSSProperties
          }
        >
          <TRProgress.Indicator
            style={{ '--tr-progress-fill': 'rgb(4, 5, 6)' } as CSSProperties}
          />
        </TRProgress.Track>
      </TRProgress.Root>
    </div>,
  );

  const tracks = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-progress-track'),
  );
  expect(
    new Set(
      tracks.slice(0, sizes.length).map((track) => getComputedStyle(track).height),
    ).size,
  ).toBe(sizes.length);
  const indicators = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-progress-indicator'),
  );
  expect(
    new Set(
      indicators
        .slice(sizes.length, sizes.length + variants.length)
        .map((indicator) => getComputedStyle(indicator).backgroundColor),
    ).size,
  ).toBe(variants.length);
  const customTrack = tracks.at(-1) as HTMLElement;
  const customIndicator = indicators.at(-1) as HTMLElement;
  expect(getComputedStyle(customTrack).backgroundColor).toBe('rgb(1, 2, 3)');
  expect(getComputedStyle(customTrack).height).toBe('17px');
  expect(getComputedStyle(customTrack).borderRadius).toBe('3px');
  expect(getComputedStyle(customIndicator).backgroundColor).toBe('rgb(4, 5, 6)');
  delete document.documentElement.dataset['theme'];
});

test('renders an indeterminate state without a fabricated current value', async () => {
  await render(
    <TRProgress.Root value={null}>
      <TRProgress.Label>Indexing</TRProgress.Label>
      <TRProgress.Track>
        <TRProgress.Indicator />
      </TRProgress.Track>
    </TRProgress.Root>,
  );
  const root = document.querySelector<HTMLElement>('.tr-progress');
  const indicator = document.querySelector<HTMLElement>('.tr-progress-indicator');
  expect(root?.hasAttribute('data-indeterminate')).toBe(true);
  expect(root?.hasAttribute('aria-valuenow')).toBe(false);
  expect(root?.getAttribute('aria-valuetext')).toBe('indeterminate progress');
  expect(indicator?.hasAttribute('data-indeterminate')).toBe(true);
  expect(
    Number.parseFloat(getComputedStyle(indicator as HTMLElement).width),
  ).toBeGreaterThan(0);
  expect(page.getByRole('progressbar', { name: 'Indexing' }).element()).toBe(root);
});

test('preserves its accessible name through narrow SSR hydration', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const fixture = (
    <div style={{ width: 320 }}>
      <TRProgress.Root uiSize="sm" value={25} variant="info">
        <TRProgress.Label>Mobile upload</TRProgress.Label>
        <TRProgress.Track>
          <TRProgress.Indicator />
        </TRProgress.Track>
        <TRProgress.Value />
      </TRProgress.Root>
    </div>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  const progress = host.querySelector<HTMLElement>('[role="progressbar"]');
  const labelId = progress?.getAttribute('aria-labelledby');
  expect(hydrationErrors).toEqual([]);
  expect(labelId).toBeTruthy();
  expect(host.querySelector(`#${labelId}`)?.textContent).toBe('Mobile upload');
  expect(progress?.clientWidth).toBeLessThanOrEqual(320);

  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});
