import './slider.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Slider, SliderRoot } from './index.js';

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
