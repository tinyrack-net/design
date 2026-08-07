import '../../core/core.css';
import '../../components/input/input.css';
import { afterEach, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRInput } from '../../components/input/index.js';
import { TINYRACK_FOCUS_MODALITY_ATTRIBUTE } from './focus-modality-provider.js';

const FOCUS_RING = 'rgb(37, 99, 235)';

afterEach(() => {
  delete document.documentElement.dataset['theme'];
});

// `outline: none` leaves width and color at their initial values, so the style
// is what decides whether anything is painted at all.
function ringOf(element: Element) {
  const style = getComputedStyle(element);
  return style.outlineStyle === 'none'
    ? 'none'
    : `${style.outlineStyle}/${style.outlineWidth}/${style.outlineColor}`;
}

function modality() {
  return document.documentElement.getAttribute(TINYRACK_FOCUS_MODALITY_ATTRIBUTE);
}

test('a mouse click focuses a field without painting the ring', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <>
      <TRInput aria-label="First" />
      <TRInput aria-label="Second" />
    </>,
  );

  const first = page.getByRole('textbox', { name: 'First' });
  const element = first.element();
  await first.click();

  expect(modality()).toBe('pointer');
  expect(document.activeElement).toBe(element);
  // Not merely "our ring is unset": the user agent paints its own focus ring in
  // that space unless the outline is turned off outright.
  expect(ringOf(element)).toBe('none');

  // Typing must not bring the ring back mid-sentence. The modality is sampled
  // when focus moves, not when a key is pressed.
  await userEvent.keyboard('Tinyrack');
  expect((element as HTMLInputElement).value).toBe('Tinyrack');
  expect(modality()).toBe('pointer');
  expect(ringOf(element)).toBe('none');

  // Moving on with the keyboard restores the indicator WCAG actually asks for.
  await userEvent.tab();
  const second = page.getByRole('textbox', { name: 'Second' }).element();
  expect(modality()).toBe('keyboard');
  expect(document.activeElement).toBe(second);
  expect(ringOf(second)).toBe(`solid/2px/${FOCUS_RING}`);
});

test('keyboard focus keeps the ring inset so the field never changes size', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(<TRInput aria-label="Only" />);

  const element = page.getByRole('textbox', { name: 'Only' }).element();
  const before = element.getBoundingClientRect();
  await userEvent.tab();
  const after = element.getBoundingClientRect();

  expect(modality()).toBe('keyboard');
  expect(getComputedStyle(element).outlineOffset).toBe('-2px');
  expect(after.width).toBe(before.width);
  expect(after.height).toBe(before.height);
});

test('without the tracker the ring still paints, so the gate fails safe', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  // A bare element carrying the class, with no Tinyrack component mounted to
  // install the tracker -- the shape a CSS-only consumer ends up with.
  await render(<input aria-label="Bare" className="tr-input" />);

  const element = page.getByRole('textbox', { name: 'Bare' }).element();
  expect(modality()).toBeNull();

  await page.getByRole('textbox', { name: 'Bare' }).click();
  expect(document.activeElement).toBe(element);
  expect(ringOf(element)).toBe(`solid/2px/${FOCUS_RING}`);
});
