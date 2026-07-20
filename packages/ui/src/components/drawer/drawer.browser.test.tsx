import '../../core/core.css';
import './drawer.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRDrawer, TRDrawerBackdrop } from './index.js';

test('renders the Tinyrack TRDrawer wrapper', async () => {
  expect(TRDrawer.Backdrop).toBe(TRDrawerBackdrop);
  await render(
    <TRDrawer.Root>
      <TRDrawer.Trigger>Open drawer</TRDrawer.Trigger>
    </TRDrawer.Root>,
  );
  expect(document.querySelector('.tr-drawer-trigger')).not.toBeNull();
});

test('opens a modal task, dismisses with Escape, and restores focus', async () => {
  const onOpenChange = vi.fn();

  await render(
    <TRDrawer.Root onOpenChange={onOpenChange} swipeDirection="down">
      <TRDrawer.Trigger>Open settings</TRDrawer.Trigger>
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Rack settings</TRDrawer.Title>
              <TRDrawer.Description>
                Update deployment preferences.
              </TRDrawer.Description>
              <TRDrawer.Close>Close settings</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-drawer-trigger');
  trigger?.click();
  await expect
    .poll(() => document.querySelector('.tr-drawer-popup')?.hasAttribute('data-open'))
    .toBe(true);

  const popup = document.querySelector<HTMLElement>('.tr-drawer-popup');
  expect(popup?.getAttribute('role')).toBe('dialog');
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);

  await userEvent.keyboard('{Escape}');
  await expect.poll(() => document.activeElement).toBe(trigger);
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(false);
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
});

test('links its accessible name and closes from the real backdrop', async () => {
  await render(
    <TRDrawer.Root swipeDirection="right">
      <TRDrawer.Trigger>Open deployment</TRDrawer.Trigger>
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Deployment</TRDrawer.Title>
              <TRDrawer.Description>Deployment settings.</TRDrawer.Description>
              <TRDrawer.Close>Done</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>,
  );

  document.querySelector<HTMLButtonElement>('.tr-drawer-trigger')?.click();
  await expect
    .poll(() => document.querySelector('.tr-drawer-popup')?.hasAttribute('data-open'))
    .toBe(true);
  const popup = document.querySelector<HTMLElement>('.tr-drawer-popup');
  expect(popup?.getAttribute('aria-labelledby')).toBeTruthy();
  expect(popup?.getAttribute('aria-describedby')).toBeTruthy();
  document.querySelector<HTMLElement>('.tr-drawer-backdrop')?.click();
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(false);
});

test('animates the popup and backdrop when opening and closing', async () => {
  await render(
    <TRDrawer.Root swipeDirection="down">
      <TRDrawer.Trigger>Open animated drawer</TRDrawer.Trigger>
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Animated drawer</TRDrawer.Title>
              <TRDrawer.Close>Close animated drawer</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>,
  );

  document.querySelector<HTMLButtonElement>('.tr-drawer-trigger')?.click();
  await expect
    .poll(() =>
      document.querySelector('.tr-drawer-popup')?.hasAttribute('data-starting-style'),
    )
    .toBe(true);
  await expect
    .poll(() => document.querySelector('.tr-drawer-popup')?.hasAttribute('data-open'))
    .toBe(true);

  const popup = document.querySelector<HTMLElement>('.tr-drawer-popup');
  const backdrop = document.querySelector<HTMLElement>('.tr-drawer-backdrop');
  const popupStyle = getComputedStyle(popup as HTMLElement);
  const backdropStyle = getComputedStyle(backdrop as HTMLElement);

  expect(popupStyle.transitionProperty).toContain('transform');
  expect(Number.parseFloat(popupStyle.transitionDuration)).toBeGreaterThan(0);
  expect(backdropStyle.transitionProperty).toContain('opacity');
  expect(Number.parseFloat(backdropStyle.transitionDuration)).toBeGreaterThan(0);

  document.querySelector<HTMLButtonElement>('.tr-drawer-close')?.click();
  await expect
    .poll(() => {
      if (popup?.isConnected !== true || backdrop?.isConnected !== true) return false;
      return (
        popup.hasAttribute('data-ending-style') &&
        getComputedStyle(popup).transform !== 'none' &&
        Number.parseFloat(getComputedStyle(backdrop).opacity) === 0
      );
    })
    .toBe(true);
  await expect.poll(() => popup?.isConnected).toBe(false);
});

test.each([
  ['down', 'flex-end', 'center', '0px', '0px'],
  ['up', 'flex-start', 'center', '0px', '0px'],
  ['left', 'stretch', 'flex-start', '0px', '0px'],
  ['right', 'stretch', 'flex-end', '0px', '0px'],
] as const)('anchors %s drawers to the matching viewport edge and squares the attached corners', async (direction, alignItems, justifyContent, firstRadius, secondRadius) => {
  const view = await render(
    <TRDrawer.Root defaultOpen swipeDirection={direction}>
      <TRDrawer.Portal>
        <TRDrawer.Viewport>
          <TRDrawer.Popup aria-label={`${direction} drawer`}>
            <TRDrawer.Content>Directional content</TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>,
  );
  const viewport = document.querySelector<HTMLElement>('.tr-drawer-viewport');
  const popup = document.querySelector<HTMLElement>('.tr-drawer-popup');
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(true);
  expect(getComputedStyle(viewport as HTMLElement).alignItems).toBe(alignItems);
  expect(getComputedStyle(viewport as HTMLElement).justifyContent).toBe(justifyContent);

  const style = getComputedStyle(popup as HTMLElement);
  const attachedRadii =
    direction === 'down'
      ? [style.borderBottomLeftRadius, style.borderBottomRightRadius]
      : direction === 'up'
        ? [style.borderTopLeftRadius, style.borderTopRightRadius]
        : direction === 'left'
          ? [style.borderTopLeftRadius, style.borderBottomLeftRadius]
          : [style.borderTopRightRadius, style.borderBottomRightRadius];
  expect(attachedRadii).toEqual([firstRadius, secondRadius]);
  await view.unmount();
});

test('opens from the edge swipe area and reports swipe as the change reason', async () => {
  const onOpenChange = vi.fn();
  await render(
    <TRDrawer.Root onOpenChange={onOpenChange} swipeDirection="down">
      <TRDrawer.SwipeArea />
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup aria-label="Swipe drawer">
            <TRDrawer.Content>Swipe content</TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>,
  );
  const area = document.querySelector<HTMLElement>('.tr-drawer-swipe-area');
  expect(area?.dataset['swipeDirection']).toBe('up');
  const dispatch = (type: string, clientY: number, buttons: number) =>
    area?.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        buttons,
        cancelable: true,
        clientX: 120,
        clientY,
        pointerId: 1,
        pointerType: 'mouse',
      }),
    );
  dispatch('pointerdown', 800, 1);
  dispatch('pointermove', 700, 1);
  dispatch('pointermove', 600, 1);
  dispatch('pointerup', 650, 0);
  await expect
    .poll(() => document.querySelector('.tr-drawer-popup')?.hasAttribute('data-open'))
    .toBe(true);
  expect(onOpenChange.mock.calls.at(-1)?.[1]?.reason).toBe('swipe');
});

test('keeps inactive provider layers from intercepting controls outside the drawer', async () => {
  const onClick = vi.fn();

  await render(
    <TRDrawer.Provider>
      <div style={{ height: 120, position: 'relative', width: 120 }}>
        <TRDrawer.IndentBackground />
        <TRDrawer.Indent>
          <button type="button" onClick={onClick}>
            Outside action
          </button>
        </TRDrawer.Indent>
      </div>
    </TRDrawer.Provider>,
  );

  await userEvent.click(
    document.querySelector<HTMLButtonElement>('button') as HTMLButtonElement,
  );
  expect(onClick).toHaveBeenCalledOnce();
});

test('keeps a closed swipe area from intercepting controls outside the drawer', async () => {
  const onClick = vi.fn();

  await render(
    <>
      <button
        type="button"
        onClick={onClick}
        style={{ bottom: 0, left: 0, position: 'fixed' }}
      >
        Bottom action
      </button>
      <div style={{ height: 120, position: 'relative', width: 120 }}>
        <TRDrawer.Root swipeDirection="down">
          <TRDrawer.SwipeArea />
        </TRDrawer.Root>
      </div>
    </>,
  );

  await userEvent.click(
    document.querySelector<HTMLButtonElement>('button') as HTMLButtonElement,
  );
  expect(onClick).toHaveBeenCalledOnce();
});

test('23 keeps bottom drawer content scrollable above the safe area', async () => {
  await render(
    <TRDrawer.Root
      defaultOpen
      defaultSnapPoint={1}
      snapPoints={[0.35, 0.7, 1]}
      swipeDirection="down"
    >
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Rack settings</TRDrawer.Title>
              <button type="button">Save</button>
              <TRDrawer.Close>Close</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>,
  );
  const popup = document.querySelector<HTMLElement>('.tr-drawer-popup');
  const content = document.querySelector<HTMLElement>('.tr-drawer-content');
  expect((popup as HTMLElement).getBoundingClientRect().bottom).toBeLessThanOrEqual(
    window.innerHeight,
  );
  expect(getComputedStyle(content as HTMLElement).overflowY).toBe('auto');
  expect(
    Number.parseFloat(getComputedStyle(content as HTMLElement).paddingBottom),
  ).toBeGreaterThanOrEqual(24);
  expect(
    document.querySelector('.tr-drawer-close')?.getBoundingClientRect().bottom,
  ).toBeLessThanOrEqual(window.innerHeight);
});
