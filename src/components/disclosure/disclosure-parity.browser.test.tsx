import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectElementParity } from '../../../e2e/fixtures/component-browser-harness.js';
import { Disclosure, DisclosureContent, DisclosureSummary } from './react.js';

test.each([false, true])('Disclosure DOM/React parity for open=%s', async (open) => {
  const raw = document.createElement('details');
  raw.className = 'tr-disclosure';
  raw.open = open;
  raw.innerHTML =
    '<summary class="tr-disclosure-summary">Advanced</summary><div class="tr-disclosure-content">Settings</div>';
  document.body.append(raw);
  const rendered = await render(
    <Disclosure open={open}>
      <DisclosureSummary>Advanced</DisclosureSummary>
      <DisclosureContent>Settings</DisclosureContent>
    </Disclosure>,
  );
  const react = rendered.container.querySelector('details')!;
  expectElementParity(raw, react);
  expectElementParity(raw.querySelector('summary')!, react.querySelector('summary')!);
  expectElementParity(
    raw.querySelector('.tr-disclosure-content')!,
    react.querySelector('.tr-disclosure-content')!,
  );
  raw.remove();
});
