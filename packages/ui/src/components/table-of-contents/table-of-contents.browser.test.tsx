import '../../core/core.css';
import './table-of-contents.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TableOfContents } from './index.js';

const items = [
  { depth: 2 as const, id: 'install', label: 'Install' },
  { depth: 3 as const, id: 'windows setup', label: 'Windows' },
];

test('renders active headings, router links, and mobile select', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const onNavigate = vi.fn();
  await render(
    <TableOfContents
      currentHeading="install"
      items={items}
      onNavigate={onNavigate}
      renderLink={(item) => (
        // biome-ignore lint/a11y/useAnchorContent: Base UI injects the heading label into this router slot.
        <a aria-label={item.label} data-router-link="" href={`#${item.id}`} />
      )}
    />,
  );
  expect(document.querySelector('[aria-current="location"]')).toHaveTextContent(
    'Install',
  );
  const activeLink = document.querySelector<HTMLElement>('[aria-current="location"]');
  const inactiveLink = document.querySelector<HTMLElement>('a:not([aria-current])');
  expect(activeLink).not.toBeNull();
  expect(inactiveLink).not.toBeNull();
  expect(getComputedStyle(activeLink as HTMLElement).backgroundColor).not.toBe(
    getComputedStyle(inactiveLink as HTMLElement).backgroundColor,
  );
  expect(getComputedStyle(activeLink as HTMLElement).fontWeight).toBe('600');
  expect(document.querySelectorAll('[data-router-link]')).toHaveLength(2);
  (activeLink as HTMLElement).click();
  expect(onNavigate).toHaveBeenCalledWith(items[0]);
  const select = document.querySelector('[role="combobox"]') as HTMLElement;
  expect(select).toHaveAccessibleName('On this page');
  await userEvent.click(select);
  await userEvent.click(document.querySelector('[role="option"]') as HTMLElement);
  expect(onNavigate).toHaveBeenCalledWith(items[0]);
});

test('returns no landmark for an empty outline and supports localized labels', async () => {
  const view = await render(<TableOfContents items={[]} />);
  expect(document.querySelector('nav')).toBeNull();
  await view.unmount();
  await render(<TableOfContents items={items} label="이 페이지" mobileLabel="목차" />);
  expect(document.querySelector('nav')).toHaveAccessibleName('이 페이지');
  const localizedSelect = document.querySelector('[role="combobox"]') as HTMLElement;
  expect(localizedSelect).toHaveAccessibleName('목차');
  await userEvent.click(localizedSelect);
  await userEvent.click(document.querySelector('[role="option"]') as HTMLElement);
});
