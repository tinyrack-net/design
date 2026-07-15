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

test('renders active headings, router links, and mobile disclosure', async () => {
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
  expect(document.querySelectorAll('[data-router-link]')).toHaveLength(4);
  const details = document.querySelector('details') as HTMLDetailsElement;
  await userEvent.click(details.querySelector('summary') as HTMLElement);
  expect(details.open).toBe(true);
  await userEvent.click(details.querySelector('a') as HTMLElement);
  expect(onNavigate).toHaveBeenCalledWith(items[0]);
});

test('returns no landmark for an empty outline and supports localized labels', async () => {
  const view = await render(<TableOfContents items={[]} />);
  expect(document.querySelector('nav')).toBeNull();
  await view.unmount();
  await render(<TableOfContents items={items} label="이 페이지" mobileLabel="목차" />);
  expect(document.querySelector('nav')).toHaveAccessibleName('이 페이지');
  expect(document.querySelector('summary')).toHaveTextContent('목차');
});
