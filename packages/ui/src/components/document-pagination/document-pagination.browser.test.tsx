import '../../core/core.css';
import './document-pagination.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRDocumentPagination } from './index.js';

const previous = {
  description: 'Start here',
  label: 'Guides',
  path: '/start',
  title: 'Getting started',
};
const next = { path: '/config', title: 'Configuration' };

test('renders router-neutral previous and next links with descriptions', async () => {
  await render(
    <TRDocumentPagination
      next={next}
      previous={previous}
      renderLink={(destination) => (
        // biome-ignore lint/a11y/useAnchorContent: Base UI injects the pagination card content into this router slot.
        <a data-router-link="" href={destination.path} />
      )}
    />,
  );
  const nav = document.querySelector('nav');
  expect(nav).toHaveAccessibleName('Previous and next documents');
  expect(nav?.querySelectorAll('[data-router-link]')).toHaveLength(2);
  expect(nav?.querySelector('[data-direction="previous"]')).toHaveAccessibleName(
    'Previous document: Getting started',
  );
  expect(nav).toHaveTextContent('Start here');
  expect(getComputedStyle(nav as HTMLElement).display).toBe('grid');
});

test('supports localized labels, one-sided pagination, and the empty state', async () => {
  const view = await render(
    <TRDocumentPagination
      label="문서 이동"
      next={next}
      nextAriaLabel="다음 문서"
      nextLabel="다음"
    />,
  );
  expect(document.querySelector('nav')).toHaveAccessibleName('문서 이동');
  expect(document.querySelector('nav')).toHaveTextContent('다음');
  expect(document.querySelector('a')).toHaveAccessibleName('다음 문서: Configuration');
  await view.unmount();
  const previousView = await render(
    <TRDocumentPagination previous={previous} previousLabel="이전" />,
  );
  expect(document.querySelector('nav')).toHaveTextContent('이전');
  await previousView.unmount();
  await render(<TRDocumentPagination />);
  expect(document.querySelector('nav')).toBeNull();
});
