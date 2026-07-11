import '../../core/core.css';
import './disclosure.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Disclosure, DisclosureContent, DisclosureSummary } from './react.js';

function waitForFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
}

test('Disclosure animates native details content without changing its semantics', async () => {
  await render(
    <Disclosure>
      <DisclosureSummary>Advanced settings</DisclosureSummary>
      <DisclosureContent>Retry failed translations twice.</DisclosureContent>
    </Disclosure>,
  );
  const details = document.querySelector<HTMLDetailsElement>('.tr-disclosure');
  const summary = document.querySelector<HTMLElement>('.tr-disclosure-summary');
  const content = document.querySelector<HTMLElement>('.tr-disclosure-content');
  if (details === null || summary === null || content === null) {
    throw new Error('Unable to find Disclosure contract elements.');
  }

  expect(details.tagName).toBe('DETAILS');
  expect(summary.tagName).toBe('SUMMARY');
  expect(details.open).toBe(false);
  const supportsAnimatedDetailsContent =
    CSS.supports('selector(details::details-content)') &&
    CSS.supports('interpolate-size', 'allow-keywords');
  if (supportsAnimatedDetailsContent) {
    expect(getComputedStyle(details, '::details-content').blockSize).toBe('0px');
  }

  summary.click();
  await waitForFrame();

  expect(details.open).toBe(true);
  const detailsContentStyle = getComputedStyle(details, '::details-content');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (supportsAnimatedDetailsContent) {
      expect(detailsContentStyle.transitionProperty).toBe('none');
    }
    expect(getComputedStyle(summary, '::after').transitionProperty).toBe('none');
  } else if (supportsAnimatedDetailsContent) {
    expect(detailsContentStyle.transitionProperty).toContain('block-size');
    expect(detailsContentStyle.transitionProperty).toContain('opacity');
    expect(detailsContentStyle.transitionDuration).not.toBe('0s');
  }
  expect(content.textContent).toContain('Retry failed translations twice.');
});
