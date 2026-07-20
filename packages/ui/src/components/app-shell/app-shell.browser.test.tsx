import '../../core/core.css';
import './app-shell.css';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRAppShell } from './index.js';

function setMobileMatch(matches: boolean) {
  const listeners = new Set<() => void>();
  const media = {
    addEventListener: (_type: string, listener: () => void) => {
      listeners.add(listener);
    },
    addListener: (listener: () => void) => {
      listeners.add(listener);
    },
    dispatchEvent: () => true,
    matches,
    media: '(width < 64rem)',
    onchange: null,
    removeEventListener: (_type: string, listener: () => void) => {
      listeners.delete(listener);
    },
    removeListener: (listener: () => void) => {
      listeners.delete(listener);
    },
  } as unknown as MediaQueryList;
  vi.spyOn(window, 'matchMedia').mockReturnValue(media);
  return media;
}

function MenuIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" />;
}

function CloseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" />;
}

function ShellFixture({
  controlled = false,
  forceControlVisibility = true,
}: {
  controlled?: boolean;
  forceControlVisibility?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <TRAppShell.Root
      breakpoint="lg"
      layout="sidebar-first"
      onOpenChange={(nextOpen) => setOpen(nextOpen)}
      {...(controlled ? { open } : {})}
    >
      <TRAppShell.Header>
        <TRAppShell.Trigger
          aria-label="Open navigation"
          style={forceControlVisibility ? { display: 'inline-flex' } : undefined}
        >
          <MenuIcon />
        </TRAppShell.Trigger>
      </TRAppShell.Header>
      <TRAppShell.Sidebar aria-label="Documentation sidebar">
        <TRAppShell.Close aria-label="Close navigation">
          <CloseIcon />
        </TRAppShell.Close>
        <a href="#docs">Docs</a>
      </TRAppShell.Sidebar>
      <TRAppShell.Main>Main content</TRAppShell.Main>
    </TRAppShell.Root>
  );
}

test('renders a static desktop sidebar landmark and both layout contracts', async () => {
  setMobileMatch(false);
  const view = await render(<ShellFixture forceControlVisibility={false} />);
  expect(document.querySelector('aside.tr-app-shell-sidebar')).not.toBeNull();
  expect(
    document.querySelector('.tr-app-shell-scroll-area')?.getAttribute('data-variant'),
  ).toBe('plain');
  expect(document.querySelectorAll('main')).toHaveLength(1);
  expect(document.querySelector('.tr-app-shell')?.getAttribute('data-layout')).toBe(
    'sidebar-first',
  );
  const desktopTrigger = document.querySelector<HTMLElement>(
    '[aria-label="Open navigation"]',
  );
  const desktopClose = document.querySelector<HTMLElement>(
    '[aria-label="Close navigation"]',
  );
  expect(desktopTrigger).not.toBeNull();
  expect(desktopClose).not.toBeNull();
  expect(desktopTrigger).toHaveClass('tr-app-shell-trigger');
  expect(desktopClose).toHaveClass('tr-app-shell-close');
  await view.unmount();

  const alternateView = await render(
    <TRAppShell.Root breakpoint="sm" layout="header-first">
      <span id="alternate-sidebar-label">Alternate navigation</span>
      <TRAppShell.Sidebar aria-labelledby="alternate-sidebar-label">
        Navigation
      </TRAppShell.Sidebar>
      <TRAppShell.Main>Alternate content</TRAppShell.Main>
    </TRAppShell.Root>,
  );
  expect(document.querySelector('.tr-app-shell')?.getAttribute('data-layout')).toBe(
    'header-first',
  );
  expect(document.querySelector('.tr-app-shell')?.getAttribute('data-breakpoint')).toBe(
    'sm',
  );
  await alternateView.unmount();
  vi.restoreAllMocks();
});

test('defaults Trigger and Close to ghost 32px controls with sm icons', async () => {
  setMobileMatch(true);
  const view = await render(
    <TRAppShell.Root defaultOpen>
      <TRAppShell.Header>
        <TRAppShell.Trigger
          aria-label="Open sized menu"
          style={{ display: 'inline-flex' }}
        >
          <MenuIcon />
        </TRAppShell.Trigger>
      </TRAppShell.Header>
      <TRAppShell.Sidebar aria-label="Sized menu">
        <TRAppShell.Close aria-label="Close sized menu">
          <CloseIcon />
        </TRAppShell.Close>
      </TRAppShell.Sidebar>
      <TRAppShell.Main>Content</TRAppShell.Main>
    </TRAppShell.Root>,
  );
  await expect
    .poll(() =>
      document.querySelector('.tr-app-shell-drawer-popup')?.hasAttribute('data-open'),
    )
    .toBe(true);

  for (const label of ['Open sized menu', 'Close sized menu']) {
    const button = document.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`);
    const icon = button?.querySelector('svg');
    expect(button?.dataset['appearance']).toBe('ghost');
    expect(button?.dataset['uiSize']).toBe('sm');
    expect(button?.getBoundingClientRect().width).toBe(32);
    expect(button?.getBoundingClientRect().height).toBe(32);
    expect(icon?.getBoundingClientRect().width).toBe(16);
    expect(icon?.getBoundingClientRect().height).toBe(16);
  }
  await view.unmount();

  await render(
    <TRAppShell.Root defaultOpen>
      <TRAppShell.Header>
        <TRAppShell.Trigger
          aria-label="Open compact menu"
          uiSize="sm"
          style={{ display: 'inline-flex' }}
        >
          <MenuIcon />
        </TRAppShell.Trigger>
      </TRAppShell.Header>
      <TRAppShell.Sidebar aria-label="Compact menu">
        <TRAppShell.Close aria-label="Close compact menu" uiSize="sm">
          <CloseIcon />
        </TRAppShell.Close>
      </TRAppShell.Sidebar>
      <TRAppShell.Main>Content</TRAppShell.Main>
    </TRAppShell.Root>,
  );
  await expect
    .poll(() =>
      document.querySelector('.tr-app-shell-drawer-popup')?.hasAttribute('data-open'),
    )
    .toBe(true);

  for (const label of ['Open compact menu', 'Close compact menu']) {
    const button = document.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`);
    expect(button?.dataset['uiSize']).toBe('sm');
    expect(button?.getBoundingClientRect().width).toBe(32);
    expect(button?.getBoundingClientRect().height).toBe(32);
  }
  vi.restoreAllMocks();
});

test('renders the mobile drawer inside a supplied portal container', async () => {
  setMobileMatch(true);
  const portalContainer = document.createElement('div');
  document.body.append(portalContainer);
  const view = await render(
    <TRAppShell.Root portalContainer={portalContainer}>
      <TRAppShell.Header>
        <TRAppShell.Trigger
          aria-label="Open contained menu"
          style={{ display: 'inline-flex' }}
        >
          <MenuIcon />
        </TRAppShell.Trigger>
      </TRAppShell.Header>
      <TRAppShell.Sidebar aria-label="Contained menu">
        <TRAppShell.Close aria-label="Close contained menu">
          <CloseIcon />
        </TRAppShell.Close>
        Navigation
      </TRAppShell.Sidebar>
      <TRAppShell.Main>Content</TRAppShell.Main>
    </TRAppShell.Root>,
  );

  await userEvent.click(
    document.querySelector<HTMLButtonElement>(
      '[aria-label="Open contained menu"]',
    ) as HTMLButtonElement,
  );
  await expect
    .poll(() => portalContainer.querySelector('.tr-app-shell-drawer-popup'))
    .not.toBeNull();
  expect(portalContainer.querySelector('.tr-app-shell-backdrop')).not.toBeNull();
  expect(document.body.querySelector(':scope > .tr-app-shell-drawer-popup')).toBeNull();

  await view.unmount();
  portalContainer.remove();
  vi.restoreAllMocks();
});

test('preserves the public Trigger ref contract', async () => {
  setMobileMatch(false);
  const callbackRef = vi.fn();
  const objectRef = createRef<HTMLButtonElement>();
  await render(
    <TRAppShell.Root>
      <TRAppShell.Trigger aria-label="Callback ref" ref={callbackRef}>
        <MenuIcon />
      </TRAppShell.Trigger>
      <TRAppShell.Trigger aria-label="Object ref" ref={objectRef}>
        <MenuIcon />
      </TRAppShell.Trigger>
      <TRAppShell.Sidebar aria-label="Ref sidebar">Navigation</TRAppShell.Sidebar>
      <TRAppShell.Main>Content</TRAppShell.Main>
    </TRAppShell.Root>,
  );
  expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  expect(objectRef.current).toBeInstanceOf(HTMLButtonElement);
  vi.restoreAllMocks();
});

test('opens a controlled mobile modal, traps focus, and supports modal dismissal', async () => {
  setMobileMatch(true);
  await render(<ShellFixture controlled />);
  const trigger = document.querySelector<HTMLButtonElement>(
    '[aria-label="Open navigation"]',
  );
  await userEvent.click(trigger as HTMLButtonElement);
  await expect
    .poll(
      () =>
        document
          .querySelector('.tr-app-shell-drawer-popup')
          ?.hasAttribute('data-open') ?? false,
    )
    .toBe(true);
  expect(
    document.querySelector('.tr-app-shell-drawer-popup')?.getAttribute('role'),
  ).toBe('dialog');
  expect(
    document.querySelector('.tr-app-shell-drawer-popup')?.getAttribute('aria-label'),
  ).toBe('Documentation sidebar');
  expect(
    document
      .querySelector<HTMLElement>('.tr-app-shell-drawer-popup')
      ?.getBoundingClientRect().width,
  ).toBe(288);
  expect(document.body.style.overflow).not.toBe('');
  await expect
    .poll(() =>
      document
        .querySelector('.tr-app-shell-drawer-popup')
        ?.contains(document.activeElement),
    )
    .toBe(true);

  document.querySelector<HTMLElement>('.tr-app-shell-backdrop')?.click();
  await expect.poll(() => document.activeElement).toBe(trigger);
  await expect
    .poll(
      () =>
        document
          .querySelector('.tr-app-shell-drawer-popup')
          ?.hasAttribute('data-open') ?? false,
    )
    .toBe(false);

  await userEvent.click(trigger as HTMLButtonElement);
  await expect
    .poll(
      () =>
        document
          .querySelector('.tr-app-shell-drawer-popup')
          ?.hasAttribute('data-open') ?? false,
    )
    .toBe(true);
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => document.activeElement).toBe(trigger);
  await expect
    .poll(
      () =>
        document
          .querySelector('.tr-app-shell-drawer-popup')
          ?.hasAttribute('data-open') ?? false,
    )
    .toBe(false);
  vi.restoreAllMocks();
});

test('supports uncontrolled default open and close button dismissal', async () => {
  setMobileMatch(true);
  await render(
    <TRAppShell.Root defaultOpen>
      <TRAppShell.Header>
        <TRAppShell.Trigger aria-label="Open menu" style={{ display: 'inline-flex' }}>
          <MenuIcon />
        </TRAppShell.Trigger>
      </TRAppShell.Header>
      <TRAppShell.Sidebar aria-label="Menu">
        <TRAppShell.Close aria-label="Close menu">
          <CloseIcon />
        </TRAppShell.Close>
      </TRAppShell.Sidebar>
      <TRAppShell.Main>Content</TRAppShell.Main>
    </TRAppShell.Root>,
  );
  await expect
    .poll(() =>
      document.querySelector('.tr-app-shell-drawer-popup')?.hasAttribute('data-open'),
    )
    .toBe(true);
  await userEvent.click(
    document.querySelector<HTMLButtonElement>(
      '[aria-label="Close menu"]',
    ) as HTMLButtonElement,
  );
  await expect
    .poll(
      () =>
        document
          .querySelector('.tr-app-shell-drawer-popup')
          ?.hasAttribute('data-open') ?? false,
    )
    .toBe(false);
  vi.restoreAllMocks();
});

test('reports a clear composition error outside Root', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  await expect(
    render(<TRAppShell.Trigger aria-label="Invalid trigger">x</TRAppShell.Trigger>),
  ).rejects.toThrow('TRAppShell.Trigger must be used inside TRAppShell.Root.');
  consoleError.mockRestore();
});
