import '../../core/core.css';
import '../field/field.css';
import './slider.css';
import { type CSSProperties, useId, useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRField } from '../field/index.js';
import { TRSlider, TRSliderRoot, type TRSliderRootProps } from './index.js';

function SliderValidationHarness() {
  const errorId = useId();
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [value, setValue] = useState(30);
  const invalid = attempted && value < 60;

  return (
    <form
      data-theme="tinyrack-light"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        if (value < 60) {
          setSubmitted(null);
          thumbInputRef.current?.focus();
          return;
        }
        setSubmitted(value);
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRSlider.Root
          onValueChange={(nextValue) =>
            setValue(Array.isArray(nextValue) ? (nextValue[0] ?? 0) : Number(nextValue))
          }
          value={[value]}
        >
          <TRSlider.Label>Reserved capacity</TRSlider.Label>
          <TRSlider.Value />
          <TRSlider.Control>
            <TRSlider.Track>
              <TRSlider.Indicator />
            </TRSlider.Track>
            <TRSlider.Thumb
              aria-describedby={invalid ? errorId : undefined}
              inputRef={thumbInputRef}
            />
          </TRSlider.Control>
        </TRSlider.Root>
        <TRField.Error id={errorId} match>
          Increase reserved capacity to 60% or more.
        </TRField.Error>
      </TRField.Root>
      <button type="submit">Reserve capacity</button>
      <output aria-live="polite" data-capacity-result="">
        {submitted === null ? '' : `Reserved ${submitted}% capacity.`}
      </output>
    </form>
  );
}

test('renders the Tinyrack TRSlider wrapper', async () => {
  expect(TRSlider.Root).toBe(TRSliderRoot);
  await render(
    <TRSlider.Root defaultValue={[50]}>
      <TRSlider.Label>Volume</TRSlider.Label>
      <TRSlider.Control>
        <TRSlider.Track>
          <TRSlider.Indicator />
        </TRSlider.Track>
        <TRSlider.Thumb />
      </TRSlider.Control>
    </TRSlider.Root>,
  );
  expect(document.querySelector('.tr-slider')).not.toBeNull();
});

test('supports compact ui size', async () => {
  await render(
    <TRSlider.Root uiSize="sm" defaultValue={[50]}>
      <TRSlider.Control>
        <TRSlider.Track>
          <TRSlider.Indicator />
        </TRSlider.Track>
        <TRSlider.Thumb aria-label="Compact volume" />
      </TRSlider.Control>
    </TRSlider.Root>,
  );
  const slider = document.querySelector<HTMLElement>('.tr-slider');
  const thumb = document.querySelector<HTMLElement>('.tr-slider-thumb');
  expect(slider?.dataset['uiSize']).toBe('sm');
  expect(getComputedStyle(thumb as HTMLElement).width).toBe('12px');
});

test('preserves the vertical measure across ui sizes while sizing each thumb', async () => {
  await render(
    <div>
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <TRSlider.Root
          data-testid={`vertical-${uiSize}`}
          defaultValue={[50]}
          key={uiSize}
          orientation="vertical"
          uiSize={uiSize}
        >
          <TRSlider.Control>
            <TRSlider.Track>
              <TRSlider.Indicator />
            </TRSlider.Track>
            <TRSlider.Thumb aria-label={`${uiSize} vertical volume`} />
          </TRSlider.Control>
        </TRSlider.Root>
      ))}
    </div>,
  );

  const roots = (['sm', 'md', 'lg'] as const).map(
    (uiSize) => document.querySelector(`[data-testid="vertical-${uiSize}"]`) as Element,
  );
  const thumbs = Array.from(document.querySelectorAll<HTMLElement>('.tr-slider-thumb'));

  expect(roots.map((root) => getComputedStyle(root).minHeight)).toEqual([
    '192px',
    '192px',
    '192px',
  ]);
  expect(thumbs.map((thumb) => getComputedStyle(thumb).width)).toEqual([
    '12px',
    '16px',
    '24px',
  ]);
});

function ControlledScalarSlider({
  onValueCommitted,
}: {
  onValueCommitted: TRSliderRootProps<number>['onValueCommitted'];
}) {
  const [value, setValue] = useState(7);
  return (
    <TRSlider.Root
      largeStep={4}
      max={15}
      min={5}
      onValueChange={setValue}
      onValueCommitted={onValueCommitted}
      step={2}
      value={value}
    >
      <TRSlider.Label>Scalar level</TRSlider.Label>
      <TRSlider.Value />
      <TRSlider.Control>
        <TRSlider.Track>
          <TRSlider.Indicator />
        </TRSlider.Track>
        <TRSlider.Thumb />
      </TRSlider.Control>
    </TRSlider.Root>
  );
}

test('controls a scalar value and honors bounds, steps, focus events, and commits', async () => {
  const onFocus = vi.fn();
  const onKeyDown = vi.fn();
  const onValueCommitted = vi.fn();
  await render(<ControlledScalarSlider onValueCommitted={onValueCommitted} />);

  const input = page.getByRole('slider', { name: 'Scalar level' }).element();
  input.addEventListener('focus', onFocus);
  input.addEventListener('keydown', onKeyDown);
  input.focus();
  await userEvent.keyboard('{ArrowRight}{Shift>}{ArrowUp}{/Shift}{End}{ArrowRight}');

  expect((input as HTMLInputElement).value).toBe('15');
  expect(input.getAttribute('min')).toBe('5');
  expect(input.getAttribute('max')).toBe('15');
  expect(input.getAttribute('step')).toBe('2');
  expect(onFocus).toHaveBeenCalledOnce();
  expect(onKeyDown).toHaveBeenCalled();
  expect(onValueCommitted.mock.calls.at(-1)?.[0]).toBe(15);
  expect(onValueCommitted.mock.calls.at(-1)?.[1].reason).toBe('keyboard');
});

test('reports a real track press and commit', async () => {
  const onValueChange = vi.fn();
  const onValueCommitted = vi.fn();
  await render(
    <TRSlider.Root
      defaultValue={[0]}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
    >
      <TRSlider.Control data-testid="pointer-control">
        <TRSlider.Track>
          <TRSlider.Indicator />
        </TRSlider.Track>
        <TRSlider.Thumb aria-label="Pointer level" />
      </TRSlider.Control>
    </TRSlider.Root>,
  );

  await page.getByTestId('pointer-control').click();
  await expect
    .poll(() => onValueChange.mock.calls.at(-1)?.[1].reason)
    .toBe('track-press');
  expect(onValueCommitted.mock.calls.at(-1)?.[1].reason).toBe('track-press');
  expect(
    Number(
      (
        page
          .getByRole('slider', { name: 'Pointer level' })
          .element() as HTMLInputElement
      ).value,
    ),
  ).toBeGreaterThan(0);
});

test('forwards root props and refs and blocks disabled interaction', async () => {
  const onClick = vi.fn();
  const onValueChange = vi.fn();
  const rootRef = { current: null as HTMLDivElement | null };
  await render(
    <TRSlider.Root
      className="consumer-slider"
      defaultValue={[40]}
      disabled
      onClick={onClick}
      onValueChange={onValueChange}
      ref={rootRef}
      style={{ width: '320px' }}
    >
      <TRSlider.Control>
        <TRSlider.Track>
          <TRSlider.Indicator />
        </TRSlider.Track>
        <TRSlider.Thumb aria-label="Disabled level" />
      </TRSlider.Control>
    </TRSlider.Root>,
  );

  const input = page.getByRole('slider', { name: 'Disabled level' }).element();
  expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
  expect(rootRef.current?.classList.contains('consumer-slider')).toBe(true);
  expect(rootRef.current?.style.width).toBe('320px');
  expect((input as HTMLInputElement).disabled).toBe(true);
  rootRef.current?.click();
  expect(onClick).toHaveBeenCalledOnce();
  input.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect((input as HTMLInputElement).value).toBe('40');
  expect(onValueChange).not.toHaveBeenCalled();
});

test('uses theme-aware track contrast and preserves the component override', async () => {
  await render(
    <div>
      {(['tinyrack-light', 'tinyrack-dark'] as const).map((theme) => (
        <div data-theme={theme} key={theme}>
          <TRSlider.Root defaultValue={[50]}>
            <TRSlider.Label>{theme}</TRSlider.Label>
            <TRSlider.Control>
              <TRSlider.Track data-testid={theme} />
            </TRSlider.Control>
          </TRSlider.Root>
        </div>
      ))}
      <TRSlider.Root
        defaultValue={[50]}
        style={{ '--tr-slider-track-background': 'rgb(1, 2, 3)' } as CSSProperties}
      >
        <TRSlider.Label>Override</TRSlider.Label>
        <TRSlider.Control>
          <TRSlider.Track data-testid="override" />
        </TRSlider.Control>
      </TRSlider.Root>
    </div>,
  );

  const light = getComputedStyle(
    document.querySelector('[data-testid="tinyrack-light"]') as Element,
  ).backgroundColor;
  const dark = getComputedStyle(
    document.querySelector('[data-testid="tinyrack-dark"]') as Element,
  ).backgroundColor;
  expect(light).not.toBe('rgba(0, 0, 0, 0)');
  expect(dark).not.toBe('rgba(0, 0, 0, 0)');
  expect(light).not.toBe(dark);
  expect(
    getComputedStyle(document.querySelector('[data-testid="override"]') as Element)
      .backgroundColor,
  ).toBe('rgb(1, 2, 3)');
});

test('keeps each thumb centered inside its control', async () => {
  await render(
    <div>
      <TRSlider.Root defaultValue={[48]}>
        <TRSlider.Label>Horizontal volume</TRSlider.Label>
        <TRSlider.Control>
          <TRSlider.Track>
            <TRSlider.Indicator />
          </TRSlider.Track>
          <TRSlider.Thumb />
        </TRSlider.Control>
      </TRSlider.Root>
      <TRSlider.Root defaultValue={[82]} orientation="vertical">
        <TRSlider.Label>Vertical volume</TRSlider.Label>
        <TRSlider.Control>
          <TRSlider.Track>
            <TRSlider.Indicator />
          </TRSlider.Track>
          <TRSlider.Thumb />
        </TRSlider.Control>
      </TRSlider.Root>
    </div>,
  );

  const controls = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-slider-control'),
  );
  const thumbs = Array.from(document.querySelectorAll<HTMLElement>('.tr-slider-thumb'));

  expect(controls).toHaveLength(2);
  expect(thumbs).toHaveLength(2);

  for (const [index, control] of controls.entries()) {
    const controlRect = control.getBoundingClientRect();
    const thumbRect = thumbs[index]?.getBoundingClientRect();

    expect(thumbRect).toBeDefined();
    if (!thumbRect) continue;

    const thumbCenterX = thumbRect.left + thumbRect.width / 2;
    const thumbCenterY = thumbRect.top + thumbRect.height / 2;

    expect(thumbCenterX).toBeGreaterThanOrEqual(controlRect.left);
    expect(thumbCenterX).toBeLessThanOrEqual(controlRect.right);
    expect(thumbCenterY).toBeGreaterThanOrEqual(controlRect.top);
    expect(thumbCenterY).toBeLessThanOrEqual(controlRect.bottom);
  }
});

test('focuses an invalid thumb and recovers after the business rule passes', async () => {
  await render(<SliderValidationHarness />);

  const input = page.getByRole('slider', { name: 'Reserved capacity' }).element();
  const root = document.querySelector<HTMLElement>('.tr-slider');
  const thumb = document.querySelector<HTMLElement>('.tr-slider-thumb');
  const button = page
    .getByRole('button', { name: 'Reserve capacity' })
    .element() as HTMLButtonElement;

  button.click();

  await expect.poll(() => document.activeElement).toBe(input);
  await expect.poll(() => root?.hasAttribute('data-invalid')).toBe(true);
  await expect
    .poll(() => getComputedStyle(thumb as HTMLElement).borderColor)
    .toBe('rgb(220, 38, 38)');
  expect(input.getAttribute('aria-describedby')).not.toBeNull();
  expect(document.body.textContent).toContain(
    'Increase reserved capacity to 60% or more.',
  );

  await userEvent.keyboard('{End}');
  await expect.poll(() => (input as HTMLInputElement).value).toBe('100');
  await expect.poll(() => root?.hasAttribute('data-invalid')).toBe(false);

  button.click();
  await expect
    .poll(
      () =>
        document.querySelector<HTMLOutputElement>('[data-capacity-result]')
          ?.textContent,
    )
    .toContain('Reserved 100% capacity.');
});

function ControlledRangeForm() {
  const [value, setValue] = useState<readonly number[]>([20, 80]);

  return (
    <form data-testid="range-form">
      <TRSlider.Root
        format={{ maximumFractionDigits: 0, style: 'unit', unit: 'percent' }}
        minStepsBetweenValues={10}
        name="window"
        onValueChange={setValue}
        value={value}
      >
        <TRSlider.Label>Maintenance window</TRSlider.Label>
        <TRSlider.Value />
        <TRSlider.Control>
          <TRSlider.Track>
            <TRSlider.Indicator />
          </TRSlider.Track>
          <TRSlider.Thumb
            aria-label="Start"
            getAriaValueText={(formattedValue) => `Starts at ${formattedValue}`}
            index={0}
          />
          <TRSlider.Thumb
            aria-label="End"
            getAriaValueText={(formattedValue) => `Ends at ${formattedValue}`}
            index={1}
          />
        </TRSlider.Control>
      </TRSlider.Root>
      <output data-testid="range-state">{value.join(',')}</output>
    </form>
  );
}

test('maps indexed range thumbs to accessible values, keyboard changes, and form data', async () => {
  await render(<ControlledRangeForm />);

  const start = page.getByRole('slider', { name: 'Start' });
  const end = page.getByRole('slider', { name: 'End' });
  expect((start.element() as HTMLInputElement).value).toBe('20');
  expect((end.element() as HTMLInputElement).value).toBe('80');
  expect(start.element().getAttribute('aria-valuetext')).toBe('Starts at 20%');
  expect(end.element().getAttribute('aria-valuetext')).toBe('Ends at 80%');

  start.element().focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect.poll(() => (start.element() as HTMLInputElement).value).toBe('21');
  expect((end.element() as HTMLInputElement).value).toBe('80');
  await expect
    .poll(() => document.querySelector('[data-testid="range-state"]')?.textContent)
    .toBe('21,80');

  const form = document.querySelector<HTMLFormElement>('[data-testid="range-form"]');
  expect(new FormData(form as HTMLFormElement).getAll('window')).toEqual(['21', '80']);
});
