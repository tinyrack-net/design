import '../../core/core.css';
import './file-tree.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { FileTree } from './index.js';

test('renders files and interactive directories as a semantic tree', async () => {
  const ref = createRef<HTMLUListElement>();
  await render(
    <FileTree.Root aria-label="Files" className="custom" ref={ref}>
      <FileTree.Directory defaultOpen={false} name="src">
        <FileTree.Root>
          <FileTree.File>index.ts</FileTree.File>
        </FileTree.Root>
      </FileTree.Directory>
      <FileTree.File>package.json</FileTree.File>
    </FileTree.Root>,
  );
  expect(ref.current?.tagName).toBe('UL');
  expect(ref.current).toHaveClass('tr-file-tree', 'custom');
  const details = document.querySelector('details') as HTMLDetailsElement;
  expect(details.open).toBe(false);
  await userEvent.click(document.querySelector('summary') as HTMLElement);
  expect(details.open).toBe(true);
  expect(getComputedStyle(ref.current as HTMLElement).display).toBe('grid');
});

test('opens directories by default', async () => {
  await render(
    <FileTree.Root>
      <FileTree.Directory name="app" />
    </FileTree.Root>,
  );
  expect(document.querySelector('details')).toHaveAttribute('open');
});
