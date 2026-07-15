import '../../core/core.css';
import './docs-search.css';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { DocsSearch, type DocsSearchResult } from './index.js';

const result: DocsSearchResult = {
  excerpt: 'Install the package.',
  excerptMatches: [{ end: 7, start: 0 }],
  id: 'install-result',
  section: 'Guide',
  sectionMatches: [{ end: 5, start: 0 }],
  title: 'Installation',
  titleMatches: [{ end: 7, start: 1 }],
  url: '/install',
};

const resultWithoutHighlights: DocsSearchResult = {
  excerpt: 'Configure the application.',
  id: 'configure-result',
  title: 'Configuration',
  url: '/configure',
};

test('renders the standalone trigger contract', async () => {
  const onClick = vi.fn();
  await render(
    <DocsSearch.Trigger label="문서 검색" onClick={onClick} shortcutLabel="⌘K" />,
  );
  const button = document.querySelector('button') as HTMLButtonElement;
  expect(button).toHaveTextContent('문서 검색');
  expect(button).toHaveTextContent('⌘K');
  await userEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('renders a compact trigger for narrow shell actions', async () => {
  await render(<DocsSearch.Trigger aria-label="Search" compact label="Search" />);
  const button = document.querySelector('button');
  expect(button).toHaveAttribute('data-compact');
  expect(button).toHaveAccessibleName('Search');
  expect(getComputedStyle(button?.querySelector('kbd') as HTMLElement).display).toBe(
    'none',
  );
});

test('searches asynchronously, highlights results, and opens the active result', async () => {
  const onSelect = vi.fn();
  const onSearch = vi.fn(async () => [result, resultWithoutHighlights]);
  const returnFocusRef = createRef<HTMLButtonElement>();
  function Fixture() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button ref={returnFocusRef} type="button">
          Return
        </button>
        <DocsSearch.Dialog
          onOpenChange={setOpen}
          onSearch={onSearch}
          onSelect={onSelect}
          open={open}
          returnFocusRef={returnFocusRef}
        />
      </>
    );
  }
  await render(<Fixture />);
  const input = document.querySelector('input') as HTMLInputElement;
  await userEvent.keyboard('{Enter}');
  await expect.poll(() => document.activeElement).toBe(input);
  await userEvent.fill(input, 'install');
  await expect.poll(() => document.querySelectorAll('[role="option"]').length).toBe(2);
  expect(document.querySelector('[role="listbox"]')).toHaveAccessibleName(
    'Search results',
  );
  expect(document.querySelectorAll('mark')).toHaveLength(3);
  const secondResult =
    document.querySelectorAll<HTMLButtonElement>('[role="option"]')[1];
  await userEvent.click(secondResult as HTMLButtonElement);
  expect(onSelect).toHaveBeenCalledWith(resultWithoutHighlights);
  await expect.poll(() => document.querySelector('[role="dialog"]')).toBeNull();
});

test('owns the command shortcut, fallback, loading, empty, and close states', async () => {
  const resolvers: Array<(value: readonly DocsSearchResult[]) => void> = [];
  const onSearch = vi.fn(
    () =>
      new Promise<readonly DocsSearchResult[]>((resolve) => {
        resolvers.push(resolve);
      }),
  );
  function Fixture() {
    const [open, setOpen] = useState(false);
    return (
      <DocsSearch.Dialog
        fallback
        messages={{ empty: '없음', fallback: '대체 검색', idle: '입력하세요' }}
        onOpenChange={setOpen}
        onSearch={onSearch}
        onSelect={() => {}}
        open={open}
      />
    );
  }
  await render(<Fixture />);
  await userEvent.keyboard('{Control>}k{/Control}');
  await expect.poll(() => document.querySelector('[role="dialog"]')).not.toBeNull();
  expect(document.body).toHaveTextContent('대체 검색');
  expect(document.body).toHaveTextContent('입력하세요');
  await userEvent.fill(document.querySelector('input') as HTMLInputElement, 'missing');
  expect(document.body).toHaveTextContent('Searching documentation');
  await userEvent.fill(
    document.querySelector('input') as HTMLInputElement,
    'missing again',
  );
  resolvers[0]?.([result]);
  resolvers[1]?.([]);
  await expect.poll(() => document.body.textContent?.includes('없음')).toBe(true);
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => document.querySelector('[role="dialog"]')).toBeNull();
});

test('moves through results and selects with the keyboard', async () => {
  const onSelect = vi.fn();
  const onSearch = vi.fn(async () => [result, resultWithoutHighlights]);
  await render(
    <DocsSearch.Dialog
      onOpenChange={() => {}}
      onSearch={onSearch}
      onSelect={onSelect}
      open
    />,
  );
  await userEvent.fill(document.querySelector('input') as HTMLInputElement, 'guide');
  await expect.poll(() => document.querySelectorAll('[role="option"]').length).toBe(2);
  await userEvent.keyboard('{ArrowDown}{ArrowUp}{Enter}');
  expect(onSelect).toHaveBeenCalledWith(result);
});

test('keeps empty keyboard navigation stable', async () => {
  await render(
    <DocsSearch.Dialog
      onOpenChange={() => {}}
      onSearch={async () => []}
      onSelect={() => {}}
      open
    />,
  );
  const input = document.querySelector('input') as HTMLInputElement;
  await userEvent.fill(input, 'missing');
  await expect
    .poll(() => document.body.textContent?.includes('No documentation'))
    .toBe(true);
  await userEvent.keyboard('{ArrowDown}{ArrowUp}{Enter}');
  expect(input).not.toHaveAttribute('aria-activedescendant');
});
