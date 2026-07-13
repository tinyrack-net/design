import '../../core/core.css';
import './scroll-area.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { ScrollArea, ScrollAreaRoot } from './index.js';

test('renders the Tinyrack ScrollArea wrapper', async () => {
  expect(ScrollArea.Root).toBe(ScrollAreaRoot);
  await render(
    <ScrollArea.Root>
      <ScrollArea.Viewport>
        <ScrollArea.Content>Scrollable content</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>,
  );
  expect(document.querySelector('.tr-scroll-area')).not.toBeNull();
});

test('keeps vertical and horizontal scroll indicators visible', async () => {
  await render(
    <ScrollArea.Root style={{ height: 160, width: 320 }}>
      <ScrollArea.Viewport>
        <ScrollArea.Content style={{ height: 320, width: 640 }}>
          Scrollable content
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>,
  );

  await expect
    .poll(() => document.querySelectorAll('.tr-scroll-area-thumb').length)
    .toBe(2);

  const verticalThumb = document.querySelector<HTMLElement>(
    '.tr-scroll-area-scrollbar[data-orientation="vertical"] .tr-scroll-area-thumb',
  );
  const horizontalThumb = document.querySelector<HTMLElement>(
    '.tr-scroll-area-scrollbar[data-orientation="horizontal"] .tr-scroll-area-thumb',
  );

  expect(verticalThumb).not.toBeNull();
  expect(horizontalThumb).not.toBeNull();
  expect((verticalThumb as HTMLElement).getBoundingClientRect().width).toBeGreaterThan(
    0,
  );
  expect(
    (horizontalThumb as HTMLElement).getBoundingClientRect().height,
  ).toBeGreaterThan(0);
});
