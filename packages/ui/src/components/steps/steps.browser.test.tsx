import '../../core/core.css';
import './steps.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRSteps } from './index.js';

test('renders semantic ordered steps, forwards props and refs, and computes layout', async () => {
  const ref = createRef<HTMLOListElement>();
  await render(
    <TRSteps.Root aria-label="Setup" className="custom" ref={ref}>
      <TRSteps.Item>Install</TRSteps.Item>
      <TRSteps.Item>Configure</TRSteps.Item>
    </TRSteps.Root>,
  );
  expect(ref.current?.tagName).toBe('OL');
  expect(ref.current).toHaveClass('tr-steps', 'custom');
  expect(ref.current?.children).toHaveLength(2);
  expect(getComputedStyle(ref.current as HTMLElement).display).toBe('grid');
});
