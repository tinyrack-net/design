import '../../core/core.css';
import './callout.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRCallout } from './index.js';

test('maps semantic variants to TRAlert variants and supplies titles', async () => {
  await render(
    <>
      <TRCallout>Note body</TRCallout>
      <TRCallout variant="tip">Tip body</TRCallout>
      <TRCallout variant="caution">Caution body</TRCallout>
      <TRCallout variant="danger" title="Stop">
        Danger body
      </TRCallout>
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

test('accepts MDX block children without nesting paragraphs', async () => {
  await render(
    <TRCallout variant="caution">
      <p>Keep this paragraph intact.</p>
      <ul>
        <li>And this list.</li>
      </ul>
    </TRCallout>,
  );

  const description = document.querySelector('.tr-callout .tr-alert-description');
  expect(description?.tagName).toBe('DIV');
  expect(description?.querySelectorAll(':scope > p')).toHaveLength(1);
  expect(description?.querySelectorAll(':scope > ul')).toHaveLength(1);
});

test('preserves native props, consumer styles, class names, and refs', async () => {
  const ref = createRef<HTMLDivElement>();

  await render(
    <TRCallout
      className="docs-callout"
      data-owner="documentation"
      ref={ref}
      role="status"
      style={{ maxWidth: '31rem' }}
    >
      Deployment complete.
    </TRCallout>,
  );

  expect(ref.current).toBe(document.querySelector('.tr-callout'));
  expect(ref.current).toHaveClass('tr-callout', 'docs-callout');
  expect(ref.current).toHaveAttribute('data-owner', 'documentation');
  expect(ref.current).toHaveAttribute('role', 'status');
  expect(ref.current?.style.maxWidth).toBe('31rem');
});
