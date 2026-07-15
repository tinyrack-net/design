import '../../core/core.css';
import './docs-shell.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { DocsShell } from './index.js';

function setDesktopMatch() {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    addEventListener: () => {},
    addListener: () => {},
    dispatchEvent: () => true,
    matches: false,
    media: '(width < 64rem)',
    onchange: null,
    removeEventListener: () => {},
    removeListener: () => {},
  } as unknown as MediaQueryList);
}

test('composes all semantic parts and exposes router state without importing a router', async () => {
  setDesktopMatch();
  const mainRef = createRef<HTMLElement>();
  await render(
    <DocsShell.Root
      currentPath="/guide"
      hash="#heading"
      layout="docs"
      locationKey="a"
      navigationKind="PUSH"
      pendingPath="/next"
    >
      <DocsShell.Header>
        <DocsShell.Brand>
          <img alt="Tinyrack" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />
        </DocsShell.Brand>
        <DocsShell.Actions>Actions</DocsShell.Actions>
      </DocsShell.Header>
      <DocsShell.Sidebar aria-label="Sidebar">Navigation</DocsShell.Sidebar>
      <DocsShell.Main className="main" contentClassName="content" ref={mainRef}>
        <h2 id="heading">Heading</h2>
      </DocsShell.Main>
      <DocsShell.Outline aria-label="Outline">On this page</DocsShell.Outline>
    </DocsShell.Root>,
  );
  expect(document.querySelector('.tr-docs-shell')).toHaveAttribute(
    'data-docs-layout',
    'docs',
  );
  expect(document.querySelector('.tr-docs-shell-progress')).not.toBeNull();
  expect(document.querySelector('.tr-docs-shell-content')).toHaveAttribute(
    'aria-busy',
    'true',
  );
  expect(document.querySelector('header')).toHaveTextContent('Actions');
  expect(document.querySelector('aside.tr-docs-shell-sidebar')).toHaveTextContent(
    'Navigation',
  );
  expect(document.querySelector('main')).toHaveClass('main');
  expect(document.querySelector('.tr-docs-shell-content')).toHaveClass('content');
  expect(
    getComputedStyle(document.querySelector('.tr-docs-shell') as HTMLElement).overflow,
  ).toBe('hidden');
  vi.restoreAllMocks();
});

test('supports splash and standalone layouts, POP scroll state, and malformed hashes', async () => {
  setDesktopMatch();
  const view = await render(
    <DocsShell.Root
      currentPath="/"
      hash="#%E0%A4%A"
      layout="splash"
      locationKey="splash"
      navigationKind="POP"
    >
      <DocsShell.Main>Landing</DocsShell.Main>
    </DocsShell.Root>,
  );
  expect(document.querySelector('.tr-docs-shell')).toHaveAttribute(
    'data-docs-layout',
    'splash',
  );
  expect(document.querySelector('.tr-docs-shell-progress')).toBeNull();
  expect(document.querySelector('.tr-docs-shell-content')).not.toHaveAttribute(
    'aria-busy',
  );
  await view.rerender(
    <DocsShell.Root
      currentPath="/api"
      layout="standalone"
      locationKey="standalone"
      navigationKind="REPLACE"
    >
      <DocsShell.Main viewportLabel="API reference">
        <div style={{ height: '200vh' }}>API</div>
      </DocsShell.Main>
    </DocsShell.Root>,
  );
  expect(document.querySelector('[role="region"]')).toHaveAccessibleName(
    'API reference',
  );
  const viewport = document.querySelector('.tr-docs-shell-scroll-viewport');
  if (viewport instanceof HTMLElement) viewport.scrollTop = 37;
  await view.rerender(
    <DocsShell.Root
      currentPath="/other"
      layout="standalone"
      locationKey="other"
      navigationKind="PUSH"
    >
      <DocsShell.Main>
        <div style={{ height: '200vh' }}>Other</div>
      </DocsShell.Main>
    </DocsShell.Root>,
  );
  await expect
    .poll(
      () =>
        (document.querySelector('.tr-docs-shell-scroll-viewport') as HTMLElement)
          .scrollTop,
    )
    .toBe(0);
  await view.rerender(
    <DocsShell.Root
      currentPath="/api"
      layout="standalone"
      locationKey="standalone"
      navigationKind="POP"
    >
      <DocsShell.Main>
        <div style={{ height: '200vh' }}>API</div>
      </DocsShell.Main>
    </DocsShell.Root>,
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
    <DocsShell.Root currentPath="/" locationKey="empty">
      <DocsShell.Brand>Brand</DocsShell.Brand>
    </DocsShell.Root>,
  );
  expect(document.querySelector('.tr-docs-shell')).not.toBeNull();
  vi.restoreAllMocks();
});

test('reports composition errors for parts outside Root', async () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  await expect(render(<DocsShell.Header />)).rejects.toThrow(
    'DocsShell.Header must be used inside DocsShell.Root.',
  );
  await expect(render(<DocsShell.Sidebar />)).rejects.toThrow(
    'DocsShell.Sidebar must be used inside DocsShell.Root.',
  );
  await expect(render(<DocsShell.Main />)).rejects.toThrow(
    'DocsShell.Main must be used inside DocsShell.Root.',
  );
  error.mockRestore();
});
