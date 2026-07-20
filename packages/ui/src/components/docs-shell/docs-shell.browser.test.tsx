import '../../core/core.css';
import './docs-shell.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRDocsShell } from './index.js';

function setViewportMatch(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    addEventListener: () => {},
    addListener: () => {},
    dispatchEvent: () => true,
    matches,
    media: '(width < 64rem)',
    onchange: null,
    removeEventListener: () => {},
    removeListener: () => {},
  } as unknown as MediaQueryList);
}

function setDesktopMatch() {
  setViewportMatch(false);
}

function setMobileMatch() {
  setViewportMatch(true);
}

test('composes all semantic parts and exposes router state without importing a router', async () => {
  setDesktopMatch();
  const mainRef = createRef<HTMLElement>();
  await render(
    <TRDocsShell.Root
      currentPath="/guide"
      hash="#heading"
      layout="docs"
      locationKey="a"
      navigationKind="PUSH"
      pendingPath="/next"
    >
      <TRDocsShell.Header>
        <TRDocsShell.Brand>
          <img alt="Tinyrack" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />
        </TRDocsShell.Brand>
        <TRDocsShell.Actions>
          <span>Actions</span>
          <button type="button">Action</button>
        </TRDocsShell.Actions>
      </TRDocsShell.Header>
      <TRDocsShell.Sidebar aria-label="Sidebar">Navigation</TRDocsShell.Sidebar>
      <TRDocsShell.Main className="main" contentClassName="content" ref={mainRef}>
        <h2 id="heading">Heading</h2>
      </TRDocsShell.Main>
      <TRDocsShell.Outline aria-label="Outline">On this page</TRDocsShell.Outline>
    </TRDocsShell.Root>,
  );
  expect(document.querySelector('.tr-docs-shell')).toHaveAttribute(
    'data-docs-layout',
    'docs',
  );
  expect(document.querySelector('.tr-docs-shell')).toHaveAttribute(
    'data-layout',
    'header-first',
  );
  expect(document.querySelector('.tr-docs-shell-progress')).not.toBeNull();
  expect(document.querySelector('.tr-docs-shell-content')).toHaveAttribute(
    'aria-busy',
    'true',
  );
  expect(document.querySelector('header')).toHaveTextContent('Actions');
  expect(
    getComputedStyle(document.querySelector('header') as HTMLElement).display,
  ).not.toBe('none');
  expect(
    getComputedStyle(document.querySelector('header') as HTMLElement).blockSize,
  ).toBe('48px');
  expect(document.querySelector('.tr-docs-shell-menu-trigger')).toHaveAttribute(
    'data-ui-size',
    'sm',
  );
  expect(document.querySelector('aside.tr-docs-shell-sidebar')).toHaveTextContent(
    'Navigation',
  );
  expect(
    getComputedStyle(
      document.querySelector('aside.tr-docs-shell-sidebar') as HTMLElement,
    ).borderInlineEndWidth,
  ).toBe('0px');
  expect(document.querySelector('main')).toHaveClass('main');
  expect(document.querySelector('.tr-docs-shell-content')).toHaveClass('content');
  expect(
    getComputedStyle(document.querySelector('.tr-docs-shell-outline') as HTMLElement)
      .display,
  ).toBe('block');
  expect(
    getComputedStyle(document.querySelector('.tr-docs-shell') as HTMLElement).overflow,
  ).toBe('hidden');
  expect(
    getComputedStyle(document.querySelector('.tr-docs-shell-menu-close') as HTMLElement)
      .display,
  ).toBe('none');
  expect(document.querySelector('.tr-docs-shell-menu-close')).toHaveAttribute(
    'data-ui-size',
    'sm',
  );
  vi.restoreAllMocks();
});

test('puts the mobile navigation trigger first and opens the drawer', async () => {
  setMobileMatch();
  await render(
    <TRDocsShell.Root currentPath="/guide" locationKey="mobile" onOpenChange={() => {}}>
      <TRDocsShell.Header>
        <TRDocsShell.Brand>Brand</TRDocsShell.Brand>
        <TRDocsShell.Actions>
          <button type="button">Action</button>
        </TRDocsShell.Actions>
      </TRDocsShell.Header>
      <TRDocsShell.Sidebar aria-label="Mobile navigation">
        Navigation
      </TRDocsShell.Sidebar>
      <TRDocsShell.Main>Content</TRDocsShell.Main>
    </TRDocsShell.Root>,
  );

  const header = document.querySelector('header') as HTMLElement;
  expect(header.querySelector('button')).toHaveAttribute(
    'aria-label',
    'Open navigation',
  );

  await userEvent.click(
    header.querySelector<HTMLButtonElement>(
      '[aria-label="Open navigation"]',
    ) as HTMLButtonElement,
  );
  await expect
    .poll(() => document.querySelector('.tr-app-shell-drawer-popup[data-open]'))
    .not.toBeNull();
  vi.restoreAllMocks();
});

test('supports splash and standalone layouts, POP scroll state, and malformed hashes', async () => {
  setDesktopMatch();
  const view = await render(
    <TRDocsShell.Root
      currentPath="/"
      hash="#%E0%A4%A"
      layout="splash"
      locationKey="splash"
      navigationKind="POP"
    >
      <TRDocsShell.Header>Header</TRDocsShell.Header>
      <TRDocsShell.Main>Landing</TRDocsShell.Main>
    </TRDocsShell.Root>,
  );
  expect(document.querySelector('.tr-docs-shell')).toHaveAttribute(
    'data-docs-layout',
    'splash',
  );
  expect(document.querySelector('.tr-docs-shell-progress')).toBeNull();
  expect(
    getComputedStyle(document.querySelector('header') as HTMLElement).display,
  ).not.toBe('none');
  expect(document.querySelector('.tr-docs-shell-content')).not.toHaveAttribute(
    'aria-busy',
  );
  await view.rerender(
    <TRDocsShell.Root
      currentPath="/api"
      layout="standalone"
      locationKey="standalone"
      navigationKind="REPLACE"
    >
      <TRDocsShell.Header>Header</TRDocsShell.Header>
      <TRDocsShell.Main viewportLabel="API reference">
        <div style={{ height: '200vh' }}>API</div>
      </TRDocsShell.Main>
    </TRDocsShell.Root>,
  );
  expect(
    getComputedStyle(document.querySelector('header') as HTMLElement).display,
  ).toBe('none');
  expect(document.querySelector('[role="region"]')).toHaveAccessibleName(
    'API reference',
  );
  const viewport = document.querySelector('.tr-docs-shell-scroll-viewport');
  if (viewport instanceof HTMLElement) viewport.scrollTop = 37;
  await view.rerender(
    <TRDocsShell.Root
      currentPath="/other"
      layout="standalone"
      locationKey="other"
      navigationKind="PUSH"
    >
      <TRDocsShell.Header>Header</TRDocsShell.Header>
      <TRDocsShell.Main>
        <div style={{ height: '200vh' }}>Other</div>
      </TRDocsShell.Main>
    </TRDocsShell.Root>,
  );
  await expect
    .poll(
      () =>
        (document.querySelector('.tr-docs-shell-scroll-viewport') as HTMLElement)
          .scrollTop,
    )
    .toBe(0);
  await view.rerender(
    <TRDocsShell.Root
      currentPath="/api"
      layout="standalone"
      locationKey="standalone"
      navigationKind="POP"
    >
      <TRDocsShell.Header>Header</TRDocsShell.Header>
      <TRDocsShell.Main>
        <div style={{ height: '200vh' }}>API</div>
      </TRDocsShell.Main>
    </TRDocsShell.Root>,
  );
  await expect
    .poll(
      () =>
        Math.abs(
          (document.querySelector('.tr-docs-shell-scroll-viewport') as HTMLElement)
            .scrollTop - 37,
        ) < 1,
    )
    .toBe(true);
  vi.restoreAllMocks();
});

test('allows a root without Main while an adapter is choosing a layout', async () => {
  setDesktopMatch();
  await render(
    <TRDocsShell.Root currentPath="/" locationKey="empty">
      <TRDocsShell.Brand>Brand</TRDocsShell.Brand>
    </TRDocsShell.Root>,
  );
  expect(document.querySelector('.tr-docs-shell')).not.toBeNull();
  vi.restoreAllMocks();
});

test('reports composition errors for parts outside Root', async () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  await expect(render(<TRDocsShell.Header />)).rejects.toThrow(
    'TRDocsShell.Header must be used inside TRDocsShell.Root.',
  );
  await expect(render(<TRDocsShell.Sidebar />)).rejects.toThrow(
    'TRDocsShell.Sidebar must be used inside TRDocsShell.Root.',
  );
  await expect(render(<TRDocsShell.Main />)).rejects.toThrow(
    'TRDocsShell.Main must be used inside TRDocsShell.Root.',
  );
  error.mockRestore();
});
