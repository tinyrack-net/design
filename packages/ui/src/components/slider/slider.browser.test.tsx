import '../../core/core.css';
import '../field/field.css';
import './slider.css';
import { useId, useRef, useState } from 'react';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Field } from '../field/index.js';
import { Slider, SliderRoot } from './index.js';

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
      <Field.Root invalid={invalid}>
        <Slider.Root
          onValueChange={(nextValue) =>
            setValue(Array.isArray(nextValue) ? (nextValue[0] ?? 0) : Number(nextValue))
          }
          value={[value]}
        >
          <Slider.Label>Reserved capacity</Slider.Label>
          <Slider.Value />
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb
              aria-describedby={invalid ? errorId : undefined}
              inputRef={thumbInputRef}
            />
          </Slider.Control>
        </Slider.Root>
        <Field.Error id={errorId} match>
          Increase reserved capacity to 60% or more.
        </Field.Error>
      </Field.Root>
      <button type="submit">Reserve capacity</button>
      <output aria-live="polite" data-capacity-result="">
        {submitted === null ? '' : `Reserved ${submitted}% capacity.`}
      </output>
    </form>
  );
}

test('renders the Tinyrack Slider wrapper', async () => {
  expect(Slider.Root).toBe(SliderRoot);
  await render(
    <Slider.Root defaultValue={[50]}>
      <Slider.Label>Volume</Slider.Label>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb />
      </Slider.Control>
    </Slider.Root>,
  );
  expect(document.querySelector('.tr-slider')).not.toBeNull();
});

test('keeps each thumb centered inside its control', async () => {
  await render(
    <div>
      <Slider.Root defaultValue={[48]}>
        <Slider.Label>Horizontal volume</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Control>
      </Slider.Root>
      <Slider.Root defaultValue={[82]} orientation="vertical">
        <Slider.Label>Vertical volume</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Control>
      </Slider.Root>
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
      <Slider.Root
        format={{ maximumFractionDigits: 0, style: 'unit', unit: 'percent' }}
        minStepsBetweenValues={10}
        name="window"
        onValueChange={(nextValue) =>
          setValue(Array.isArray(nextValue) ? nextValue : [nextValue as number])
        }
        value={value}
      >
        <Slider.Label>Maintenance window</Slider.Label>
        <Slider.Value />
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
          </Slider.Track>
          <Slider.Thumb
            aria-label="Start"
            getAriaValueText={(formattedValue) => `Starts at ${formattedValue}`}
            index={0}
          />
          <Slider.Thumb
            aria-label="End"
            getAriaValueText={(formattedValue) => `Ends at ${formattedValue}`}
            index={1}
          />
        </Slider.Control>
      </Slider.Root>
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
