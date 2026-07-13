import '../../core/core.css';
import './popover.css';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './react.js';

afterEach(() => cleanup());

function waitForBrowser() {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}

test('renders and controls the canonical React Popover contract', async () => {
  await render(
    <Popover placement="bottom-end">
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>
        <PopoverClose>Close</PopoverClose>
      </PopoverContent>
    </Popover>,
  );
  document.querySelector<HTMLButtonElement>('button')!.click();
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
  const content = document.querySelector<HTMLElement>('[popover]')!;
  expect(content.matches(':popover-open')).toBe(true);
  expect(content.dataset['placement']?.startsWith('bottom')).toBe(true);
  content.querySelector<HTMLButtonElement>('[data-tr-overlay-close]')!.click();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  expect(content.matches(':popover-open')).toBe(false);
});

test('preserves a prevented Popover close handler', async () => {
  await render(
    <Popover defaultOpen>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>
        <PopoverClose onClick={(event) => event.preventDefault()}>
          Blocked close
        </PopoverClose>
      </PopoverContent>
    </Popover>,
  );
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  const content = document.querySelector<HTMLElement>('[popover]');
  content?.querySelector<HTMLButtonElement>('[data-tr-overlay-close]')?.click();
  expect(content?.matches(':popover-open')).toBe(true);
});

test('restores a controlled Popover when native dismissal is rejected', async () => {
  const onOpenChange = vi.fn();
  await render(
    <Popover open onOpenChange={onOpenChange}>
      <PopoverContent>Controlled</PopoverContent>
    </Popover>,
  );
  await waitForBrowser();
  const content = document.querySelector<HTMLElement>('[popover]')!;
  content.hidePopover();
  await waitForBrowser();

  expect(onOpenChange).toHaveBeenCalledWith(
    false,
    expect.objectContaining({ reason: 'native-dismiss' }),
  );
  expect(content.matches(':popover-open')).toBe(true);
});
