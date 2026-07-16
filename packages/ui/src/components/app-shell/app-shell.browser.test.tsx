import '../../core/core.css';
import './app-shell.css';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { AppShell } from './index.js';

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
    <AppShell.Root
      breakpoint="lg"
      layout="sidebar-first"
      onOpenChange={(nextOpen) => setOpen(nextOpen)}
      {...(controlled ? { open } : {})}
    >
      <AppShell.Header>
        <AppShell.Trigger
          aria-label="Open navigation"
          style={forceControlVisibility ? { display: 'inline-flex' } : undefined}
        >
          <MenuIcon />
        </AppShell.Trigger>
      </AppShell.Header>
      <AppShell.Sidebar aria-label="Documentation sidebar">
        <AppShell.Close aria-label="Close navigation">
          <CloseIcon />
        </AppShell.Close>
        <a href="#docs">Docs</a>
      </AppShell.Sidebar>
      <AppShell.Main>Main content</AppShell.Main>
    </AppShell.Root>
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
    <AppShell.Root breakpoint="sm" layout="header-first">
      <span id="alternate-sidebar-label">Alternate navigation</span>
      <AppShell.Sidebar aria-labelledby="alternate-sidebar-label">
        Navigation
      </AppShell.Sidebar>
      <AppShell.Main>Alternate content</AppShell.Main>
    </AppShell.Root>,
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
    <AppShell.Root defaultOpen>
      <AppShell.Header>
        <AppShell.Trigger
          aria-label="Open sized menu"
          style={{ display: 'inline-flex' }}
        >
          <MenuIcon />
        </AppShell.Trigger>
      </AppShell.Header>
      <AppShell.Sidebar aria-label="Sized menu">
        <AppShell.Close aria-label="Close sized menu">
          <CloseIcon />
        </AppShell.Close>
      </AppShell.Sidebar>
      <AppShell.Main>Content</AppShell.Main>
    </AppShell.Root>,
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
    expect(button?.dataset['size']).toBe('sm');
    expect(button?.getBoundingClientRect().width).toBe(32);
    expect(button?.getBoundingClientRect().height).toBe(32);
    expect(icon?.getBoundingClientRect().width).toBe(16);
    expect(icon?.getBoundingClientRect().height).toBe(16);
  }
  await view.unmount();

  await render(
    <AppShell.Root defaultOpen>
      <AppShell.Header>
        <AppShell.Trigger
          aria-label="Open compact menu"
          size="sm"
          style={{ display: 'inline-flex' }}
        >
          <MenuIcon />
        </AppShell.Trigger>
      </AppShell.Header>
      <AppShell.Sidebar aria-label="Compact menu">
        <AppShell.Close aria-label="Close compact menu" size="sm">
          <CloseIcon />
        </AppShell.Close>
      </AppShell.Sidebar>
      <AppShell.Main>Content</AppShell.Main>
    </AppShell.Root>,
  );
  await expect
    .poll(() =>
      document.querySelector('.tr-app-shell-drawer-popup')?.hasAttribute('data-open'),
    )
    .toBe(true);

  for (const label of ['Open compact menu', 'Close compact menu']) {
    const button = document.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`);
    expect(button?.dataset['size']).toBe('sm');
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
    <AppShell.Root portalContainer={portalContainer}>
      <AppShell.Header>
        <AppShell.Trigger
          aria-label="Open contained menu"
          style={{ display: 'inline-flex' }}
        >
          <MenuIcon />
        </AppShell.Trigger>
      </AppShell.Header>
      <AppShell.Sidebar aria-label="Contained menu">
        <AppShell.Close aria-label="Close contained menu">
          <CloseIcon />
        </AppShell.Close>
        Navigation
      </AppShell.Sidebar>
      <AppShell.Main>Content</AppShell.Main>
    </AppShell.Root>,
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
    <AppShell.Root>
      <AppShell.Trigger aria-label="Callback ref" ref={callbackRef}>
        <MenuIcon />
      </AppShell.Trigger>
      <AppShell.Trigger aria-label="Object ref" ref={objectRef}>
        <MenuIcon />
      </AppShell.Trigger>
      <AppShell.Sidebar aria-label="Ref sidebar">Navigation</AppShell.Sidebar>
      <AppShell.Main>Content</AppShell.Main>
    </AppShell.Root>,
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
    <AppShell.Root defaultOpen>
      <AppShell.Header>
        <AppShell.Trigger aria-label="Open menu" style={{ display: 'inline-flex' }}>
          <MenuIcon />
        </AppShell.Trigger>
      </AppShell.Header>
      <AppShell.Sidebar aria-label="Menu">
        <AppShell.Close aria-label="Close menu">
          <CloseIcon />
        </AppShell.Close>
      </AppShell.Sidebar>
      <AppShell.Main>Content</AppShell.Main>
    </AppShell.Root>,
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
    render(<AppShell.Trigger aria-label="Invalid trigger">x</AppShell.Trigger>),
  ).rejects.toThrow('AppShell.Trigger must be used inside AppShell.Root.');
  consoleError.mockRestore();
});
