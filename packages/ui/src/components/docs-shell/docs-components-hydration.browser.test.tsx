import '../../core/core.css';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import { TRCallout } from '../callout/index.js';
import { TRColorSchemeToggle } from '../color-scheme-toggle/index.js';
import { TRDocsNavigation } from '../docs-navigation/index.js';
import { TRDocsSearch } from '../docs-search/index.js';
import { TRDocumentPagination } from '../document-pagination/index.js';
import { TRFileTree } from '../file-tree/index.js';
import { TRLanguageSelect } from '../language-select/index.js';
import { TRSteps } from '../steps/index.js';
import { TRTableOfContents } from '../table-of-contents/index.js';
import { TRDocsShell } from './index.js';

const noop = () => {};
const search = async () => [];

function AllDocsComponents() {
  return (
    <TRDocsShell.Root currentPath="/guide" locationKey="ssr">
      <TRDocsShell.Header>
        <TRDocsShell.Brand>Tinyrack</TRDocsShell.Brand>
      </TRDocsShell.Header>
      <TRDocsShell.Sidebar aria-label="Documentation">
        <TRDocsSearch.Trigger />
        <TRDocsNavigation
          currentPath="/guide"
          items={[{ label: 'Guide', path: '/guide', type: 'page' }]}
        />
      </TRDocsShell.Sidebar>
      <TRDocsShell.Main>
        <TRColorSchemeToggle onValueChange={noop} value="dark" />
        <TRLanguageSelect
          onValueChange={noop}
          options={[{ label: 'English', value: 'en' }]}
          value="en"
        />
        <TRCallout>Hydration safe.</TRCallout>
        <TRSteps.Root>
          <TRSteps.Item>Install</TRSteps.Item>
        </TRSteps.Root>
        <TRFileTree>
          <ul>
            <li>index.ts</li>
          </ul>
        </TRFileTree>
        <TRTableOfContents items={[{ depth: 2, id: 'install', label: 'Install' }]} />
        <TRDocumentPagination next={{ path: '/next', title: 'Next' }} />
      </TRDocsShell.Main>
      <TRDocsSearch.Dialog
        onOpenChange={noop}
        onSearch={search}
        onSelect={noop}
        open={false}
      />
    </TRDocsShell.Root>
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
