import '../../core/core.css';
import './file-tree.css';
import { createRef } from 'react';
import { createPortal } from 'react-dom';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
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
  expect(document.querySelectorAll('.tr-file-tree-file')).toHaveLength(4);
  expect(document.querySelector('summary')?.textContent).toBe('src');
  expect(document.querySelectorAll('summary')[1]?.textContent).toBe('components');
  expect(document.body.textContent).toContain('…');
  expect(getComputedStyle(ref.current as HTMLElement).display).toBe('grid');
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
