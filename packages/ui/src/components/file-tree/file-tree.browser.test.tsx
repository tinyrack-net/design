import '../../core/core.css';
import './file-tree.css';
import { act, type CSSProperties, createRef } from 'react';
import { createPortal } from 'react-dom';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TinyrackMdxList } from '../../mdx/react-components/List.js';
import { TinyrackMdxListItem } from '../../mdx/react-components/ListItem.js';
import { TinyrackMdxParagraph } from '../../mdx/react-components/Paragraph.js';
import { TRFileTree } from './index.js';

function fixture() {
  return (
    <ul>
      <li>package.json</li>
      <li>
        <strong>src</strong>
        <ul>
          <li>
            <code>components</code>
            <ul>
              <li>Header.tsx</li>
              <li>...</li>
            </ul>
          </li>
          <li>pages/</li>
        </ul>
      </li>
    </ul>
  );
}

test('converts nested Markdown lists into a semantic file tree', async () => {
  const ref = createRef<HTMLUListElement>();
  await render(
    <TRFileTree aria-label="Files" className="custom" ref={ref}>
      {fixture()}
    </TRFileTree>,
  );

  expect(ref.current?.tagName).toBe('UL');
  expect(ref.current).toHaveClass('tr-file-tree', 'custom');
  expect(ref.current).toHaveAttribute('aria-label', 'Files');
  expect(document.querySelectorAll('.tr-file-tree-directory')).toHaveLength(3);
  expect(document.querySelectorAll('.tr-file-tree-file')).toHaveLength(2);
  expect(document.querySelectorAll('.tr-file-tree-placeholder')).toHaveLength(2);
  expect(document.querySelector('summary')?.textContent).toBe('src');
  expect(document.querySelectorAll('summary')[1]?.textContent).toBe('components');
  expect(document.body.textContent).toContain('…');
  expect(getComputedStyle(ref.current as HTMLElement).display).toBe('grid');
});

test('parses lists authored through the docs MDX component pipeline', async () => {
  // The docs MDX pipeline maps `ul`/`li`/`p` to TinyrackMdx* components rather than
  // rendering the host tags, so a Markdown-authored tree arrives as these components.
  // The file tree must still recognize the structure via their `mdxTag` markers.
  await render(
    <TRFileTree aria-label="Files">
      <TinyrackMdxList>
        <TinyrackMdxListItem>package.json</TinyrackMdxListItem>
        <TinyrackMdxListItem>
          <TinyrackMdxParagraph>src</TinyrackMdxParagraph>
          <TinyrackMdxList>
            <TinyrackMdxListItem>index.ts</TinyrackMdxListItem>
            <TinyrackMdxListItem>pages/</TinyrackMdxListItem>
          </TinyrackMdxList>
        </TinyrackMdxListItem>
      </TinyrackMdxList>
    </TRFileTree>,
  );

  expect(document.querySelectorAll('.tr-file-tree-directory')).toHaveLength(2);
  expect(document.querySelectorAll('.tr-file-tree-file')).toHaveLength(2);
  expect(document.querySelector('summary')?.textContent).toBe('src');
  expect(document.querySelector('.tr-mdx-list')).toBeNull();
});

test('opens directories by default and supports native disclosure toggling', async () => {
  await render(
    <TRFileTree>
      <ul>
        <li>
          src
          <ul>
            <li>index.ts</li>
          </ul>
        </li>
      </ul>
    </TRFileTree>,
  );

  const details = document.querySelector('details') as HTMLDetailsElement;
  expect(details.open).toBe(true);
  await userEvent.click(document.querySelector('summary') as HTMLElement);
  expect(details.open).toBe(false);
});

test('supports native keyboard disclosure without replacing authored inline Markdown', async () => {
  await render(
    <TRFileTree>
      <ul>
        <li>
          <a href="/src">
            <strong>src</strong>
          </a>
          <ul>
            <li>
              <code>routes/$locale.components.tsx</code>
            </li>
          </ul>
        </li>
      </ul>
    </TRFileTree>,
  );

  const details = document.querySelector('details') as HTMLDetailsElement;
  const summary = document.querySelector('summary') as HTMLElement;
  const link = summary.querySelector('a');
  expect(link).toHaveAttribute('href', '/src');
  expect(summary.querySelector('strong')).toHaveTextContent('src');
  expect(document.querySelector('.tr-file-tree-file code')).toHaveTextContent(
    'routes/$locale.components.tsx',
  );

  summary.focus();
  expect(summary).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  expect(details.open).toBe(false);
  await userEvent.keyboard(' ');
  expect(details.open).toBe(true);
});

test('keeps empty-directory placeholders decorative and distinct from authored files', async () => {
  await render(
    <TRFileTree>
      <ul>
        <li>empty/</li>
        <li>...</li>
        <li>src/index.ts</li>
      </ul>
    </TRFileTree>,
  );

  const placeholders = document.querySelectorAll('.tr-file-tree-placeholder');
  expect(placeholders).toHaveLength(2);
  expect(placeholders[0]).toHaveAttribute('aria-hidden', 'true');
  expect(placeholders[1]).toHaveAttribute('aria-hidden', 'true');
  expect(document.querySelectorAll('.tr-file-tree-file')).toHaveLength(1);
  expect(document.querySelector('.tr-file-tree-file')).toHaveTextContent(
    'src/index.ts',
  );
});

test('keeps each nested depth as a guided tree branch', async () => {
  await render(<TRFileTree>{fixture()}</TRFileTree>);

  const roots = document.querySelectorAll('.tr-file-tree');
  const nestedRoot = roots[1] as HTMLElement;
  nestedRoot.style.setProperty('--tinyrack-border-width-default', '1px');
  nestedRoot.style.setProperty('--tinyrack-border', 'rgb(1 1 1)');

  expect(nestedRoot.matches('.tr-file-tree > li > details > .tr-file-tree')).toBe(true);
  expect(getComputedStyle(nestedRoot).borderInlineStartStyle).toBe('solid');
});

test('preserves loose-list inline content and ignores non-list entries', async () => {
  await render(
    <TRFileTree>
      <ul>
        <li>
          <p>
            <strong>src</strong> <code>(source)</code>
          </p>
          <ul>
            <li>index.ts</li>
          </ul>
        </li>
        <li>
          <span>README.md</span>
        </li>
        <div>ignored</div>
      </ul>
    </TRFileTree>,
  );

  expect(document.querySelector('summary')?.innerHTML).toContain(
    '<strong>src</strong>',
  );
  expect(document.body.textContent).toContain('(source)');
  expect(document.querySelectorAll('.tr-file-tree-file')).toHaveLength(2);
  expect(document.body.textContent).not.toContain('ignored');
});

test('passes through children when no Markdown list is provided', async () => {
  await render(
    <TRFileTree data-testid="file-tree-fallback">
      <li>pre-rendered</li>
    </TRFileTree>,
  );

  expect(
    document.querySelector('[data-testid="file-tree-fallback"]')?.textContent,
  ).toBe('pre-rendered');
});

test('ignores non-element React nodes while deriving entry names', async () => {
  const portalTarget = document.createElement('div');
  document.body.append(portalTarget);

  await render(
    <TRFileTree>
      <ul>
        <li>{createPortal('portal content', portalTarget)}</li>
      </ul>
    </TRFileTree>,
  );

  expect(document.querySelector('.tr-file-tree-file')?.textContent).toBe('');
  expect(portalTarget).toHaveTextContent('portal content');
});

test('supports component tokens and wraps long paths inside narrow containers', async () => {
  await render(
    <div data-testid="narrow" style={{ width: '160px' }}>
      <TRFileTree
        data-testid="customized"
        style={
          {
            '--tr-file-tree-background': 'rgb(1 2 3)',
            '--tr-file-tree-border': 'rgb(4 5 6)',
            '--tr-file-tree-padding': '8px',
          } as CSSProperties
        }
      >
        <ul>
          <li>packages/application/src/components/VeryLongUnbrokenFilename.tsx</li>
        </ul>
      </TRFileTree>
    </div>,
  );

  const context = document.querySelector<HTMLElement>('[data-testid="narrow"]');
  const tree = document.querySelector<HTMLElement>('[data-testid="customized"]');
  const style = getComputedStyle(tree as HTMLElement);
  expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
  expect(style.borderTopColor).toBe('rgb(4, 5, 6)');
  expect(style.paddingTop).toBe('8px');
  expect((context as HTMLElement).scrollWidth).toBe(
    (context as HTMLElement).clientWidth,
  );
});

test('server renders and hydrates authored nested content without a mismatch', async () => {
  const fixture = (
    <TRFileTree aria-label="Project files">
      <ul>
        <li>
          <p>
            <strong>src</strong>
          </p>
          <ul>
            <li>index.ts</li>
          </ul>
        </li>
      </ul>
    </TRFileTree>
  );
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);

  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(host, fixture);
  });

  expect(host.querySelector('summary')).toHaveTextContent('src');
  expect(
    consoleError.mock.calls.some((call) => String(call[0]).includes('hydration')),
  ).toBe(false);
  await act(async () => root?.unmount());
  host.remove();
  consoleError.mockRestore();
});
