import '../../core/core.css';
import './meter.css';
import { act, type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRMeter, TRMeterRoot } from './index.js';

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

test('renders the Tinyrack TRMeter wrapper', async () => {
  expect(TRMeter.Root).toBe(TRMeterRoot);
  await render(
    <TRMeter.Root value={60}>
      <TRMeter.Label>Usage</TRMeter.Label>
      <TRMeter.Track>
        <TRMeter.Indicator />
      </TRMeter.Track>
      <TRMeter.Value />
    </TRMeter.Root>,
  );
  expect(document.querySelector('.tr-meter')).not.toBeNull();
});

test('keeps formatted values inside the existing min, max, and value contract', async () => {
  await render(
    <TRMeter.Root
      format={{ style: 'unit', unit: 'gigabyte', unitDisplay: 'short' }}
      max={128}
      min={0}
      value={64}
    >
      <TRMeter.Label>Storage usage</TRMeter.Label>
      <TRMeter.Track>
        <TRMeter.Indicator />
      </TRMeter.Track>
      <TRMeter.Value />
    </TRMeter.Root>,
  );
  const root = document.querySelector<HTMLElement>('.tr-meter');
  expect(root?.getAttribute('aria-valuemin')).toBe('0');
  expect(root?.getAttribute('aria-valuemax')).toBe('128');
  expect(root?.getAttribute('aria-valuenow')).toBe('64');
  expect(document.querySelector('.tr-meter-value')?.textContent).toContain('64');
});

test('clamps formatted and announced values to the meter range', async () => {
  await render(
    <TRMeter.Root
      format={{ style: 'unit', unit: 'gigabyte', unitDisplay: 'short' }}
      getAriaValueText={(formatted, value) => `${formatted} (${value}) used`}
      max={100}
      min={20}
      value={120}
    >
      <TRMeter.Label>Storage usage</TRMeter.Label>
      <TRMeter.Value />
      <TRMeter.Track>
        <TRMeter.Indicator />
      </TRMeter.Track>
    </TRMeter.Root>,
  );

  const root = page.getByRole('meter', { name: 'Storage usage' }).element();
  expect(root.getAttribute('aria-valuenow')).toBe('100');
  expect(root.getAttribute('aria-valuetext')).toContain('(100) used');
  expect(document.querySelector('.tr-meter-value')?.textContent).toContain('100');
  expect(document.querySelector<HTMLElement>('.tr-meter-indicator')?.style.width).toBe(
    '100%',
  );
});

test('resolves NaN to the minimum before formatting and announcing it', async () => {
  await render(
    <TRMeter.Root
      format={{ style: 'unit', unit: 'celsius', unitDisplay: 'short' }}
      getAriaValueText={(formatted, value) => `${formatted} (${value}) minimum`}
      max={80}
      min={20}
      value={Number.NaN}
    >
      <TRMeter.Label>Safe temperature</TRMeter.Label>
      <TRMeter.Value />
      <TRMeter.Track>
        <TRMeter.Indicator />
      </TRMeter.Track>
    </TRMeter.Root>,
  );

  const root = page.getByRole('meter', { name: 'Safe temperature' }).element();
  expect(root.getAttribute('aria-valuenow')).toBe('20');
  expect(root.getAttribute('aria-valuetext')).toContain('(20) minimum');
  expect(document.querySelector('.tr-meter-value')?.textContent).toContain('20');
  expect(document.querySelector<HTMLElement>('.tr-meter-indicator')?.style.width).toBe(
    '0%',
  );
});

test('links its label, exposes a human value, and sizes the indicator', async () => {
  await render(
    <TRMeter.Root
      getAriaValueText={(formatted) => `${formatted} used`}
      max={100}
      min={0}
      value={25}
    >
      <TRMeter.Label>Storage usage</TRMeter.Label>
      <TRMeter.Track>
        <TRMeter.Indicator />
      </TRMeter.Track>
      <TRMeter.Value />
    </TRMeter.Root>,
  );

  const root = document.querySelector<HTMLElement>('.tr-meter');
  const label = document.querySelector<HTMLElement>('.tr-meter-label');
  const indicator = document.querySelector<HTMLElement>('.tr-meter-indicator');
  expect(root?.getAttribute('role')).toBe('meter');
  expect(root?.getAttribute('aria-labelledby')).toBe(label?.id);
  expect(root?.getAttribute('aria-valuetext')).toContain('used');
  expect(indicator?.style.width).toBe('25%');
});

test('applies every explicit semantic variant over the contrast-safe track', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const variants = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
  await render(
    <div>
      {variants.map((variant) => (
        <TRMeter.Root aria-label={variant} key={variant} value={50} variant={variant}>
          <TRMeter.Track>
            <TRMeter.Indicator />
          </TRMeter.Track>
        </TRMeter.Root>
      ))}
    </div>,
  );

  const indicators = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-meter-indicator'),
  );
  expect(
    new Set(indicators.map((indicator) => getComputedStyle(indicator).backgroundColor))
      .size,
  ).toBe(variants.length);
  const track = document.querySelector<HTMLElement>('.tr-meter-track');
  expect(getComputedStyle(track as HTMLElement).backgroundColor).toBe(
    'rgb(115, 115, 115)',
  );
  delete document.documentElement.dataset['theme'];
});

test('preserves refs, native props, styles, and the Base UI render contract', async () => {
  const rootRef = createRef<HTMLDivElement>();
  const indicatorRef = createRef<HTMLDivElement>();
  await render(
    <TRMeter.Root
      aria-describedby="meter-help"
      className="consumer-meter"
      ref={rootRef}
      render={<section />}
      style={{ marginLeft: '7px' }}
      value={40}
      variant="info"
    >
      <TRMeter.Label>Capacity</TRMeter.Label>
      <TRMeter.Value>{(formatted) => `${formatted} occupied`}</TRMeter.Value>
      <TRMeter.Track data-testid="meter-track">
        <TRMeter.Indicator ref={indicatorRef} />
      </TRMeter.Track>
    </TRMeter.Root>,
  );

  expect(rootRef.current).toBeInstanceOf(HTMLElement);
  expect(rootRef.current?.tagName).toBe('SECTION');
  expect(rootRef.current).toHaveClass('tr-meter', 'consumer-meter');
  expect(rootRef.current?.getAttribute('aria-describedby')).toBe('meter-help');
  expect(rootRef.current?.dataset['variant']).toBe('info');
  expect(getComputedStyle(rootRef.current as HTMLElement).marginLeft).toBe('7px');
  expect(indicatorRef.current).toHaveClass('tr-meter-indicator');
  expect(document.querySelector('.tr-meter-value')?.textContent).toContain('occupied');
});

test('supports public track and indicator customization tokens at narrow widths', async () => {
  await render(
    <div style={{ width: 240 }}>
      <TRMeter.Root
        aria-label="Customized capacity"
        style={
          {
            '--tr-meter-indicator-background': 'rgb(12, 34, 56)',
            '--tr-meter-min-width': '0px',
            '--tr-meter-track-background': 'rgb(210, 211, 212)',
            '--tr-meter-track-size': '12px',
          } as CSSProperties
        }
        value={50}
      >
        <TRMeter.Track>
          <TRMeter.Indicator />
        </TRMeter.Track>
      </TRMeter.Root>
    </div>,
  );

  const root = document.querySelector<HTMLElement>('.tr-meter');
  const track = document.querySelector<HTMLElement>('.tr-meter-track');
  const indicator = document.querySelector<HTMLElement>('.tr-meter-indicator');
  expect(root?.clientWidth).toBeLessThanOrEqual(240);
  expect(getComputedStyle(track as HTMLElement).height).toBe('12px');
  expect(getComputedStyle(track as HTMLElement).backgroundColor).toBe(
    'rgb(210, 211, 212)',
  );
  expect(getComputedStyle(indicator as HTMLElement).backgroundColor).toBe(
    'rgb(12, 34, 56)',
  );
});

test('disables indicator motion when reduced motion is requested', () => {
  const meterStyles = [...document.styleSheets]
    .flatMap((sheet) => [...sheet.cssRules])
    .find((rule) => rule.cssText.includes('.tr-meter {'))?.cssText;
  expect(meterStyles).toContain('@media (prefers-reduced-motion: reduce)');
  expect(meterStyles).toContain('.tr-meter-indicator');
  expect(meterStyles).toContain('transition: none');
});

test('server-renders and hydrates a localized meter without changing its name', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const fixture = (
    <TRMeter.Root
      format={{ style: 'unit', unit: 'gigabyte', unitDisplay: 'short' }}
      locale="ja-JP"
      max={128}
      value={64}
    >
      <TRMeter.Label>ストレージ使用量</TRMeter.Label>
      <TRMeter.Value />
      <TRMeter.Track>
        <TRMeter.Indicator />
      </TRMeter.Track>
    </TRMeter.Root>
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
  const meter = host.querySelector<HTMLElement>('[role="meter"]');
  const labelId = meter?.getAttribute('aria-labelledby');
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector(`#${labelId}`)?.textContent).toBe('ストレージ使用量');
  expect(host.querySelector('.tr-meter-value')?.textContent).toContain('64');

  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});
