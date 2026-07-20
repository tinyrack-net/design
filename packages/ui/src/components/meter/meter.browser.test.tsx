import '../../core/core.css';
import './meter.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRMeter, TRMeterRoot } from './index.js';

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
