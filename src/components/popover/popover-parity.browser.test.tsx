import '../../core/core.css';
import './popover.css';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { Popover, PopoverContent, PopoverTrigger } from './react.js';

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
});

test('keeps raw HTML and React Popover markup aligned', async () => {
  const raw = document.createElement('div');
  raw.className = 'tr-layer';
  raw.setAttribute('popover', 'auto');
  raw.dataset['placement'] = 'bottom-start';
  document.body.append(raw);
  await render(
    <Popover id="react-popover">
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent />
    </Popover>,
  );
  const react = document.querySelectorAll<HTMLElement>('[popover]')[1]!;
  expect(react.className).toBe(raw.className);
  expect(react.getAttribute('popover')).toBe(raw.getAttribute('popover'));
  expect(react.dataset['placement']).toBe(raw.dataset['placement']);
});
