import '../../core/core.css';
import './document-pagination.css';
import { act, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
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

test('preserves nav props, styles, refs, and native events', async () => {
  const ref = createRef<HTMLElement>();
  const onClick = vi.fn((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  });
  await render(
    <TRDocumentPagination
      className="consumer-pagination"
      data-testid="pagination"
      next={next}
      onClick={onClick}
      ref={ref}
      style={{ marginBlockStart: '7px' }}
    />,
  );

  const nav = document.querySelector<HTMLElement>('[data-testid="pagination"]');
  expect(ref.current).toBe(nav);
  expect(nav).toHaveClass('tr-document-pagination', 'consumer-pagination');
  expect(nav?.style.marginBlockStart).toBe('7px');
  await userEvent.click(nav?.querySelector('a') as HTMLAnchorElement);
  expect(onClick).toHaveBeenCalledOnce();
});

test('exposes direction semantics and reports enabled navigation only', async () => {
  const onNavigate = vi.fn();
  const localPrevious = { ...previous, path: '#previous' };
  await render(
    <TRDocumentPagination
      dir="rtl"
      next={{ ...next, disabled: true }}
      onNavigate={onNavigate}
      previous={localPrevious}
      renderLink={(_destination, direction) => (
        // biome-ignore lint/a11y: Base UI injects the pagination card href and content into this router slot.
        <a data-render-direction={direction} />
      )}
    />,
  );

  const previousLink = document.querySelector<HTMLAnchorElement>(
    '[data-direction="previous"]',
  );
  const nextLink = document.querySelector<HTMLAnchorElement>('[data-direction="next"]');
  expect(previousLink?.rel).toBe('prev');
  expect(previousLink?.dataset['renderDirection']).toBe('previous');
  expect(nextLink?.rel).toBe('next');
  expect(nextLink?.dataset['renderDirection']).toBe('next');
  expect(nextLink).toHaveAttribute('aria-disabled', 'true');
  expect(nextLink?.hasAttribute('href')).toBe(false);
  const previousArrow = previousLink?.querySelector<HTMLElement>(
    '.tr-document-pagination-arrow',
  );
  expect(previousArrow).toHaveAttribute('aria-hidden', 'true');
  expect(getComputedStyle(previousArrow as HTMLElement).transform).not.toBe('none');

  await userEvent.click(previousLink as HTMLAnchorElement);
  nextLink?.click();
  expect(onNavigate).toHaveBeenCalledOnce();
  expect(onNavigate).toHaveBeenCalledWith(localPrevious, 'previous');
});

test('contains long destination content at narrow widths', async () => {
  const view = await render(
    <div style={{ width: 220 }}>
      <TRDocumentPagination
        next={{
          description: 'unbroken-description-that-must-not-overflow-the-preview-canvas',
          label: 'unbroken-label-that-must-wrap',
          path: '/long',
          title: 'unbroken-title-that-must-wrap-inside-the-pagination-card',
        }}
      />
    </div>,
  );
  const nav = document.querySelector<HTMLElement>('.tr-document-pagination');
  const title = document.querySelector<HTMLElement>(
    '.tr-document-pagination-link > strong',
  );

  expect(getComputedStyle(title as HTMLElement).overflowWrap).toBe('anywhere');
  expect(nav?.scrollWidth).toBeLessThanOrEqual(nav?.clientWidth ?? 0);
  await view.unmount();
});

test('server renders and hydrates without a mismatch', async () => {
  const fixture = <TRDocumentPagination next={next} previous={previous} />;
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  let root: ReturnType<typeof hydrateRoot> | undefined;

  await act(async () => {
    root = hydrateRoot(host, fixture);
  });
  expect(host.querySelectorAll('.tr-document-pagination-link')).toHaveLength(2);
  expect(
    consoleError.mock.calls.some((call) => String(call[0]).includes('hydration')),
  ).toBe(false);
  await act(async () => root?.unmount());
  host.remove();
  consoleError.mockRestore();
});
