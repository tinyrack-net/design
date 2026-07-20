import '../../core/core.css';
import './app-shell.css';
import { type CSSProperties, createRef, useState } from 'react';
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

function RailFixture({
  controlled = false,
  mobileSidebar = 'drawer',
}: {
  controlled?: boolean;
  mobileSidebar?: 'drawer' | 'rail';
}) {
  const [mode, setMode] = useState<'expanded' | 'rail'>('expanded');
  return (
    <TRAppShell.Root
      mobileSidebar={mobileSidebar}
      onSidebarModeChange={setMode}
      {...(controlled ? { sidebarMode: mode } : {})}
    >
      <TRAppShell.Header>Header</TRAppShell.Header>
      <TRAppShell.Sidebar aria-label="Rail navigation">
        <TRAppShell.SidebarToggle aria-label="Toggle sidebar">
          <MenuIcon />
        </TRAppShell.SidebarToggle>
        <a href="#overview">
          <MenuIcon />
          <TRAppShell.SidebarLabel>Overview</TRAppShell.SidebarLabel>
        </a>
        <TRAppShell.Close aria-label="Close rail navigation">
          <CloseIcon />
        </TRAppShell.Close>
      </TRAppShell.Sidebar>
      <TRAppShell.Main>Main content</TRAppShell.Main>
    </TRAppShell.Root>
  );
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
    <TRAppShell.Root defaultOpen defaultSidebarMode="rail">
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
        <TRAppShell.SidebarLabel>Expanded drawer label</TRAppShell.SidebarLabel>
      </TRAppShell.Sidebar>
      <TRAppShell.Main>Content</TRAppShell.Main>
    </TRAppShell.Root>,
  );
  await expect
    .poll(() =>
      document.querySelector('.tr-app-shell-drawer-popup')?.hasAttribute('data-open'),
    )
    .toBe(true);
  expect(
    document.querySelector('.tr-app-shell-sidebar')?.getAttribute('data-sidebar-mode'),
  ).toBe('expanded');
  expect(
    document
      .querySelector<HTMLElement>('.tr-app-shell-sidebar-label')
      ?.getBoundingClientRect().width,
  ).toBeGreaterThan(1);

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

test.each([
  false,
  true,
])('toggles the %s sidebar mode while preserving accessibility and refs', async (controlled) => {
  setMobileMatch(false);
  const callback = vi.fn();
  const toggleRef = createRef<HTMLButtonElement>();
  await render(
    <TRAppShell.Root
      mobileSidebar="rail"
      onSidebarModeChange={callback}
      {...(controlled ? { sidebarMode: 'expanded' as const } : {})}
    >
      <TRAppShell.Sidebar aria-label="Mode navigation">
        <TRAppShell.SidebarToggle aria-label="Toggle mode" ref={toggleRef}>
          <MenuIcon />
        </TRAppShell.SidebarToggle>
      </TRAppShell.Sidebar>
      <TRAppShell.Main>Content</TRAppShell.Main>
    </TRAppShell.Root>,
  );
  const root = document.querySelector('.tr-app-shell');
  const toggle = toggleRef.current as HTMLButtonElement;
  expect(toggle).toBeInstanceOf(HTMLButtonElement);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  toggle.focus();
  await userEvent.keyboard('{Enter}');
  expect(document.activeElement).toBe(toggle);
  expect(callback).toHaveBeenCalledWith('rail');
  if (controlled) {
    expect(root?.getAttribute('data-sidebar-mode')).toBe('expanded');
  } else {
    expect(root?.getAttribute('data-sidebar-mode')).toBe('rail');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  }
  vi.restoreAllMocks();
});

test('does not toggle the sidebar mode when the consumer prevents the click', async () => {
  setMobileMatch(false);
  const callback = vi.fn();
  await render(
    <TRAppShell.Root mobileSidebar="rail" onSidebarModeChange={callback}>
      <TRAppShell.Sidebar aria-label="Prevented navigation">
        <TRAppShell.SidebarToggle
          aria-label="Prevent mode change"
          onClick={(event) => event.preventDefault()}
        >
          <MenuIcon />
        </TRAppShell.SidebarToggle>
      </TRAppShell.Sidebar>
      <TRAppShell.Main>Content</TRAppShell.Main>
    </TRAppShell.Root>,
  );
  await userEvent.click(
    document.querySelector<HTMLButtonElement>(
      '[aria-label="Prevent mode change"]',
    ) as HTMLButtonElement,
  );
  expect(callback).not.toHaveBeenCalled();
  expect(
    document.querySelector('.tr-app-shell')?.getAttribute('data-sidebar-mode'),
  ).toBe('expanded');
  vi.restoreAllMocks();
});

test('uses expanded and rail widths, supports overrides, and preserves link names', async () => {
  setMobileMatch(false);
  const screen = await render(
    <div style={{ '--tr-app-shell-sidebar-rail-width': '5rem' } as CSSProperties}>
      <TRAppShell.Root defaultSidebarMode="rail" mobileSidebar="rail">
        <TRAppShell.Sidebar aria-label="Width navigation">
          <a href="#overview">
            <MenuIcon />
            <TRAppShell.SidebarLabel>Overview</TRAppShell.SidebarLabel>
          </a>
        </TRAppShell.Sidebar>
        <TRAppShell.Main>Content</TRAppShell.Main>
      </TRAppShell.Root>
    </div>,
  );
  const root = document.querySelector<HTMLElement>('.tr-app-shell');
  const sidebar = document.querySelector<HTMLElement>('.tr-app-shell-sidebar');
  const label = document.querySelector<HTMLElement>('.tr-app-shell-sidebar-label');
  expect(root?.getAttribute('data-sidebar-mode')).toBe('rail');
  expect(sidebar?.getAttribute('data-sidebar-mode')).toBe('rail');
  expect(sidebar?.getBoundingClientRect().width).toBe(80);
  expect(label?.getBoundingClientRect().width).toBeLessThanOrEqual(1);
  await expect.element(screen.getByRole('link', { name: 'Overview' })).toBeVisible();
  vi.restoreAllMocks();
});

test('renders an inline fixed rail on mobile without drawer anatomy', async () => {
  setMobileMatch(true);
  await render(<RailFixture mobileSidebar="rail" />);
  const root = document.querySelector<HTMLElement>('.tr-app-shell');
  const sidebar = document.querySelector<HTMLElement>('.tr-app-shell-sidebar');
  expect(root?.getAttribute('data-mobile-sidebar')).toBe('rail');
  expect(root?.getAttribute('data-sidebar-mode')).toBe('rail');
  expect(sidebar?.getAttribute('data-sidebar-mode')).toBe('rail');
  expect(sidebar?.getBoundingClientRect().width).toBe(64);
  expect(document.querySelector('.tr-app-shell-drawer-popup')).toBeNull();
  expect(document.querySelector('.tr-app-shell-backdrop')).toBeNull();
  expect(document.querySelector('.tr-app-shell-close')).toBeNull();
  expect(document.querySelector('.tr-app-shell-sidebar-toggle')).toBeNull();
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
