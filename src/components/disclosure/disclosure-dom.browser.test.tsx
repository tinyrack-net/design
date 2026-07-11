import '../../core/core.css';
import './disclosure.css';
import { expect, test } from 'vitest';

test.each([
  false,
  true,
])('raw Disclosure preserves native open=%s behavior', async (open) => {
  const details = document.createElement('details');
  details.className = 'tr-disclosure';
  details.open = open;
  details.innerHTML =
    '<summary class="tr-disclosure-summary">Advanced</summary><div class="tr-disclosure-content">Settings</div>';
  document.body.append(details);
  expect(details.open).toBe(open);
  (details.querySelector('summary') as HTMLElement).click();
  expect(details.open).toBe(!open);
  details.remove();
});
