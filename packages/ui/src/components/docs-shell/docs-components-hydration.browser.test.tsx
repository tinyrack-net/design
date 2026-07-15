import '../../core/core.css';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import { Callout } from '../callout/index.js';
import { ColorSchemeToggle } from '../color-scheme-toggle/index.js';
import { DocsNavigation } from '../docs-navigation/index.js';
import { DocsSearch } from '../docs-search/index.js';
import { DocumentPagination } from '../document-pagination/index.js';
import { FileTree } from '../file-tree/index.js';
import { LanguageSelect } from '../language-select/index.js';
import { Steps } from '../steps/index.js';
import { TableOfContents } from '../table-of-contents/index.js';
import { DocsShell } from './index.js';

const noop = () => {};
const search = async () => [];

function AllDocsComponents() {
  return (
    <DocsShell.Root currentPath="/guide" locationKey="ssr">
      <DocsShell.Header>
        <DocsShell.Brand>Tinyrack</DocsShell.Brand>
      </DocsShell.Header>
      <DocsShell.Sidebar aria-label="Documentation">
        <DocsSearch.Trigger />
        <DocsNavigation
          currentPath="/guide"
          items={[{ label: 'Guide', path: '/guide', type: 'page' }]}
        />
      </DocsShell.Sidebar>
      <DocsShell.Main>
        <ColorSchemeToggle onValueChange={noop} value="dark" />
        <LanguageSelect
          onValueChange={noop}
          options={[{ label: 'English', value: 'en' }]}
          value="en"
        />
        <Callout>Hydration safe.</Callout>
        <Steps.Root>
          <Steps.Item>Install</Steps.Item>
        </Steps.Root>
        <FileTree.Root>
          <FileTree.File>index.ts</FileTree.File>
        </FileTree.Root>
        <TableOfContents items={[{ depth: 2, id: 'install', label: 'Install' }]} />
        <DocumentPagination next={{ path: '/next', title: 'Next' }} />
      </DocsShell.Main>
      <DocsSearch.Dialog
        onOpenChange={noop}
        onSearch={search}
        onSelect={noop}
        open={false}
      />
    </DocsShell.Root>
  );
}

test('server renders and hydrates all documentation components without mismatch', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  container.innerHTML = renderToString(<AllDocsComponents />);
  document.body.append(container);
  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(container, <AllDocsComponents />);
  });
  expect(container.querySelector('.tr-docs-shell')).not.toBeNull();
  expect(container.querySelector('.tr-callout')).toHaveTextContent('Hydration safe.');
  expect(
    consoleError.mock.calls.some((call) => String(call[0]).includes('hydration')),
  ).toBe(false);
  await act(async () => root?.unmount());
  container.remove();
  consoleError.mockRestore();
});
