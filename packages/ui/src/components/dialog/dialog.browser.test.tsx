import '../../core/core.css';
import '../tabs/tabs.css';
import './dialog.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRTabs } from '../tabs/index.js';
import { TRDialog, type TRDialogPopupProps, TRDialogRoot } from './index.js';

const invalidSize: TRDialogPopupProps = {
  // @ts-expect-error TRDialog.Popup no longer exposes a size recipe.
  size: 'sm',
};
void invalidSize;

test('uses Base UI dialog focus and dismissal behavior', async () => {
  expect(TRDialog.Root).toBe(TRDialogRoot);
  await render(
    <TRDialog.Root defaultOpen>
      <TRDialog.Trigger>Open</TRDialog.Trigger>
      <TRDialog.Portal>
        <TRDialog.Backdrop />
        <TRDialog.Popup placement="middle">
          <TRDialog.Title>Confirm</TRDialog.Title>
          <TRDialog.Description>Continue?</TRDialog.Description>
          <TRDialog.Close>Close</TRDialog.Close>
        </TRDialog.Popup>
      </TRDialog.Portal>
    </TRDialog.Root>,
  );
  const popup = document.querySelector<HTMLElement>('.tr-dialog');
  expect(popup?.getAttribute('role')).toBe('dialog');
  expect(popup?.hasAttribute('data-size')).toBe(false);
  document.querySelector<HTMLButtonElement>('.tr-dialog-close')?.click();
  await expect.poll(() => popup?.hasAttribute('data-closed')).toBe(true);
});

test('opens from its trigger and restores focus after close', async () => {
  await render(
    <TRDialog.Root>
      <TRDialog.Trigger>Open settings</TRDialog.Trigger>
      <TRDialog.Portal>
        <TRDialog.Backdrop />
        <TRDialog.Popup>
          <TRDialog.Title>Settings</TRDialog.Title>
          <TRDialog.Description>Update rack settings.</TRDialog.Description>
          <TRDialog.Close>Save and close</TRDialog.Close>
        </TRDialog.Popup>
      </TRDialog.Portal>
    </TRDialog.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-dialog-trigger');
  trigger?.click();
  await expect
    .poll(() => document.activeElement?.classList.contains('tr-dialog-close'))
    .toBe(true);
  const close = document.querySelector<HTMLButtonElement>('.tr-dialog-close');
  close?.click();
  await expect.poll(() => document.activeElement).toBe(trigger);
});

test('layers modal surfaces above active tabs', async () => {
  await render(
    <>
      <TRTabs.Root defaultValue="preview">
        <TRTabs.List aria-label="Example tabs">
          <TRTabs.Tab value="preview">Preview</TRTabs.Tab>
          <TRTabs.Tab value="source">Source</TRTabs.Tab>
        </TRTabs.List>
        <TRTabs.Panel value="preview">Preview content</TRTabs.Panel>
        <TRTabs.Panel value="source">Source content</TRTabs.Panel>
      </TRTabs.Root>
      <TRDialog.Root defaultOpen>
        <TRDialog.Portal>
          <TRDialog.Backdrop />
          <TRDialog.Popup>
            <TRDialog.Title>Layered dialog</TRDialog.Title>
            <TRDialog.Description>
              Modal content stays above the page.
            </TRDialog.Description>
            <TRDialog.Close>Close</TRDialog.Close>
          </TRDialog.Popup>
        </TRDialog.Portal>
      </TRDialog.Root>
    </>,
  );

  const activeTab = document.querySelector<HTMLElement>('.tr-tabs-tab[data-active]');
  const backdrop = document.querySelector<HTMLElement>('.tr-dialog-backdrop');
  const popup = document.querySelector<HTMLElement>('.tr-dialog-box');

  expect(activeTab).not.toBeNull();
  expect(backdrop).not.toBeNull();
  expect(popup).not.toBeNull();
  if (activeTab === null || backdrop === null || popup === null) {
    throw new Error('Expected the active tab and dialog layers to render.');
  }
  expect(getComputedStyle(backdrop).zIndex).toBe('900');
  expect(getComputedStyle(popup).zIndex).toBe('1210');

  const activeTabBounds = activeTab.getBoundingClientRect();
  expect(
    document.elementFromPoint(
      activeTabBounds.left + activeTabBounds.width / 2,
      activeTabBounds.top + activeTabBounds.height / 2,
    ),
  ).toBe(backdrop);
});

test('omits size recipes for both top and bottom edge placements', async () => {
  const top = await render(
    <TRDialog.Root defaultOpen modal={false}>
      <TRDialog.Portal>
        <TRDialog.Popup placement="top">
          <TRDialog.Title>Top notice</TRDialog.Title>
          <TRDialog.Description>Anchored to the top edge.</TRDialog.Description>
        </TRDialog.Popup>
      </TRDialog.Portal>
    </TRDialog.Root>,
  );
  const topPopup = document.querySelector<HTMLElement>('.tr-dialog-box');
  expect(topPopup?.dataset['placement']).toBe('top');
  expect(topPopup?.hasAttribute('data-size')).toBe(false);
  await top.unmount();

  await render(
    <TRDialog.Root defaultOpen modal={false}>
      <TRDialog.Portal>
        <TRDialog.Popup placement="bottom">
          <TRDialog.Title>Bottom notice</TRDialog.Title>
          <TRDialog.Description>Anchored to the bottom edge.</TRDialog.Description>
        </TRDialog.Popup>
      </TRDialog.Portal>
    </TRDialog.Root>,
  );
  const bottomPopup = document.querySelector<HTMLElement>('.tr-dialog-box');
  expect(bottomPopup?.dataset['placement']).toBe('bottom');
  expect(bottomPopup?.hasAttribute('data-size')).toBe(false);
});
