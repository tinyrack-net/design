import '../../core/core.css';
import './disclosure.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Disclosure, DisclosureContent, DisclosureSummary } from './react.js';

test.each([
  false,
  true,
])('React Disclosure preserves native open=%s behavior', async (open) => {
  const onToggle = vi.fn();
  const ref = createRef<HTMLDetailsElement>();
  const screen = await render(
    <Disclosure className="consumer" onToggle={onToggle} open={open} ref={ref}>
      <DisclosureSummary>Advanced</DisclosureSummary>
      <DisclosureContent>Settings</DisclosureContent>
    </Disclosure>,
  );
  expect(ref.current).toHaveClass('tr-disclosure', 'consumer');
  await screen.getByText('Advanced').click();
  expect(ref.current?.open).toBe(!open);
  expect(onToggle).toHaveBeenCalled();
});
