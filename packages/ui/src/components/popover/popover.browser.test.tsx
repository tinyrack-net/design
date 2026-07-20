import './popover.css';
import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRPopover, TRPopoverRoot } from './index.js';

function DetailsPopover({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <TRPopover.Root onOpenChange={onOpenChange}>
      <TRPopover.Trigger>Details</TRPopover.Trigger>
      <TRPopover.Portal>
        <TRPopover.Positioner>
          <TRPopover.Popup>
            <TRPopover.Title>Server status</TRPopover.Title>
            <TRPopover.Description>Rack Alpha is online.</TRPopover.Description>
            <TRPopover.Close>Close details</TRPopover.Close>
          </TRPopover.Popup>
        </TRPopover.Positioner>
      </TRPopover.Portal>
    </TRPopover.Root>
  );
}

test('opens by pointer with accessible title and description relationships', async () => {
  expect(TRPopover.Root).toBe(TRPopoverRoot);
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
  const screen = await render(<DetailsPopover />);
  const trigger = screen.getByRole('button', { exact: true, name: 'Details' });
  await userEvent.type(trigger, '{Enter}');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
  await userEvent.type(trigger, '{Escape}');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect.element(trigger).toHaveFocus();
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
        <TRPopover.Root onOpenChange={setOpen} open={open}>
          <TRPopover.Trigger>Controlled details</TRPopover.Trigger>
          <TRPopover.Portal>
            <TRPopover.Positioner>
              <TRPopover.Popup>
                <TRPopover.Title>Controlled status</TRPopover.Title>
                <TRPopover.Close>Done</TRPopover.Close>
              </TRPopover.Popup>
            </TRPopover.Positioner>
          </TRPopover.Portal>
        </TRPopover.Root>
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
