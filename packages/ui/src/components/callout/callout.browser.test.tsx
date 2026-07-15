import '../../core/core.css';
import './callout.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Callout } from './index.js';

test('maps semantic variants to Alert variants and supplies titles', async () => {
  await render(
    <>
      <Callout>Note body</Callout>
      <Callout variant="tip">Tip body</Callout>
      <Callout variant="caution">Caution body</Callout>
      <Callout variant="danger" title="Stop">
        Danger body
      </Callout>
    </>,
  );
  const callouts = document.querySelectorAll('.tr-callout');
  expect(callouts[0]).toHaveAttribute('data-variant', 'info');
  expect(callouts[0]).toHaveTextContent('Note');
  expect(callouts[1]).toHaveAttribute('data-variant', 'success');
  expect(callouts[2]).toHaveAttribute('data-variant', 'warning');
  expect(callouts[3]).toHaveAttribute('data-variant', 'danger');
  expect(callouts[3]).toHaveTextContent('Stop');
  expect(getComputedStyle(callouts[0] as HTMLElement).display).toBe('block');
});
