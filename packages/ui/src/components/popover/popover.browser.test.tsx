import './popover.css';
import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Popover, PopoverRoot } from './index.js';

function DetailsPopover({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Popover.Root onOpenChange={onOpenChange}>
      <Popover.Trigger>Details</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Title>Server status</Popover.Title>
            <Popover.Description>Rack Alpha is online.</Popover.Description>
            <Popover.Close>Close details</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

test('opens by pointer with accessible title and description relationships', async () => {
  expect(Popover.Root).toBe(PopoverRoot);
  const onOpenChange = vi.fn();
  await render(<DetailsPopover onOpenChange={onOpenChange} />);
  const trigger = page.getByRole('button', { name: 'Details' }).element();
  await userEvent.click(trigger);

  const popup = page.getByRole('dialog', { name: 'Server status' }).element();
  expect(popup).toHaveClass('tr-layer');
  expect(popup.getAttribute('aria-labelledby')).toBeTruthy();
  expect(popup.getAttribute('aria-describedby')).toBeTruthy();
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});

test('dismisses with Escape and restores trigger focus', async () => {
  await render(<DetailsPopover />);
  const trigger = page.getByRole('button', { name: 'Details' }).element();
  trigger.focus();
  await userEvent.keyboard('{Enter}');
  await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('false');
  await expect.poll(() => document.activeElement).toBe(trigger);
});

test('dismisses on outside pointer interaction and remains within viewport bounds', async () => {
  await render(
    <>
      <DetailsPopover />
      <button type="button">Outside action</button>
    </>,
  );
  const trigger = page.getByRole('button', { name: 'Details' }).element();
  await userEvent.click(trigger);
  const popup = page.getByRole('dialog', { name: 'Server status' }).element();
  const rect = popup.getBoundingClientRect();
  expect(rect.left).toBeGreaterThanOrEqual(0);
  expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
  await userEvent.click(page.getByRole('button', { name: 'Outside action' }).element());
  await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('false');
});

test('keeps controlled open state synchronized with the close action', async () => {
  function ControlledPopover() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Popover.Root onOpenChange={setOpen} open={open}>
          <Popover.Trigger>Controlled details</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Popup>
                <Popover.Title>Controlled status</Popover.Title>
                <Popover.Close>Done</Popover.Close>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        <output>{open ? 'open' : 'closed'}</output>
      </>
    );
  }

  await render(<ControlledPopover />);
  await userEvent.click(
    page.getByRole('button', { name: 'Controlled details' }).element(),
  );
  await expect.poll(() => document.querySelector('output')?.textContent).toBe('open');
  await userEvent.click(page.getByRole('button', { name: 'Done' }).element());
  await expect.poll(() => document.querySelector('output')?.textContent).toBe('closed');
});
