import '../../core/core.css';
import './pagination.css';
import { act, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRPagination } from './index.js';

const hrefFor = (page: number) => (page === 1 ? '/blog/' : `/blog/page/${page}/`);

test('marks the current page as non-interactive and names the landmark', async () => {
  await render(<TRPagination currentPage={3} hrefFor={hrefFor} totalPages={10} />);
  const nav = document.querySelector('nav');
  expect(nav).toHaveAccessibleName('Pagination');

  const current = nav?.querySelector('[aria-current="page"]');
  expect(current).toHaveTextContent('3');
  expect(current?.tagName).toBe('SPAN');
  expect(nav?.querySelector('a[href="/blog/page/3/"]')).toBeNull();
});

test('links page one to the unpaginated href', async () => {
  await render(<TRPagination currentPage={4} hrefFor={hrefFor} totalPages={10} />);
  expect(document.querySelector('a[href="/blog/"]')).toHaveAccessibleName('Page 1');
});

test('disables the previous step on the first page and the next step on the last', async () => {
  await render(<TRPagination currentPage={1} hrefFor={hrefFor} totalPages={5} />);
  const previous = document.querySelector('[data-direction="previous"]');
  expect(previous).toHaveAttribute('aria-disabled', 'true');
  expect(previous).not.toHaveAttribute('href');
  expect(previous).toHaveAttribute('tabindex', '-1');
  expect(document.querySelector('[data-direction="next"]')).toHaveAttribute(
    'href',
    '/blog/page/2/',
  );
});

test('points the steps at the neighbouring pages with rel hints', async () => {
  await render(<TRPagination currentPage={3} hrefFor={hrefFor} totalPages={5} />);
  const previous = document.querySelector('[data-direction="previous"]');
  const next = document.querySelector('[data-direction="next"]');
  expect(previous).toHaveAttribute('href', '/blog/page/2/');
  expect(previous).toHaveAttribute('rel', 'prev');
  expect(next).toHaveAttribute('href', '/blog/page/4/');
  expect(next).toHaveAttribute('rel', 'next');
});

test('hides the ellipsis from assistive technology', async () => {
  await render(<TRPagination currentPage={10} hrefFor={hrefFor} totalPages={20} />);
  const ellipses = document.querySelectorAll('.tr-pagination-ellipsis');
  expect(ellipses).toHaveLength(2);
  for (const ellipsis of ellipses) {
    expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
  }
});

test('renders nothing for a single page', async () => {
  await render(<TRPagination currentPage={1} hrefFor={hrefFor} totalPages={1} />);
  expect(document.querySelector('nav')).toBeNull();
});

test('accepts localized labels for the landmark, steps, and pages', async () => {
  await render(
    <TRPagination
      currentPage={2}
      hrefFor={hrefFor}
      label="페이지 매김"
      nextLabel="다음"
      pageLabel={(page) => `${page}페이지`}
      previousLabel="이전"
      totalPages={5}
    />,
  );
  expect(document.querySelector('nav')).toHaveAccessibleName('페이지 매김');
  expect(document.querySelector('[data-direction="previous"]')).toHaveAccessibleName(
    '이전: 1페이지',
  );
  expect(document.querySelector('[data-direction="next"]')).toHaveAccessibleName(
    '다음: 3페이지',
  );
  expect(document.querySelector('a[href="/blog/page/4/"]')).toHaveAccessibleName(
    '4페이지',
  );
});

test('composes a router-neutral link via renderLink without touching the current page', async () => {
  await render(
    <TRPagination
      currentPage={3}
      hrefFor={hrefFor}
      renderLink={(page, state) => (
        // biome-ignore lint/a11y/useAnchorContent: Base UI injects the link content into this router slot.
        // biome-ignore lint/a11y/useValidAnchor: Base UI injects the href into this router slot.
        <a data-router-page={page} data-router-direction={state.direction ?? 'page'} />
      )}
      totalPages={5}
    />,
  );
  // Five pages, minus the current one, plus both steps.
  expect(document.querySelectorAll('[data-router-page]')).toHaveLength(6);
  expect(document.querySelectorAll('[data-router-direction="previous"]')).toHaveLength(
    1,
  );
  expect(document.querySelectorAll('[data-router-direction="next"]')).toHaveLength(1);
});

test('does not compose a router link into a disabled step', async () => {
  await render(
    <TRPagination
      currentPage={1}
      hrefFor={hrefFor}
      renderLink={(page) => (
        // biome-ignore lint/a11y/useAnchorContent: Base UI injects the link content into this router slot.
        // biome-ignore lint/a11y/useValidAnchor: Base UI injects the href into this router slot.
        <a data-router-page={page} />
      )}
      totalPages={5}
    />,
  );
  const previous = document.querySelector('[data-direction="previous"]');
  expect(previous).not.toHaveAttribute('data-router-page');
  expect(previous).toHaveAttribute('aria-disabled', 'true');
});

// Tokens are authored as hex but computed styles come back as `rgb(...)`.
function resolveColor(value: string) {
  const probe = document.createElement('span');
  probe.style.color = value;
  document.body.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

test('paints the current page with the primary surface in both color schemes', async () => {
  await render(<TRPagination currentPage={2} hrefFor={hrefFor} totalPages={5} />);
  const current = document.querySelector('[data-current]') as HTMLElement;

  for (const theme of ['tinyrack-light', 'tinyrack-dark']) {
    document.documentElement.setAttribute('data-theme', theme);
    const root = getComputedStyle(document.documentElement);
    const primary = resolveColor(root.getPropertyValue('--tinyrack-primary').trim());
    const onPrimary = resolveColor(
      root.getPropertyValue('--tinyrack-on-primary').trim(),
    );
    // The two must actually differ, or the label would be invisible.
    expect(primary).not.toBe(onPrimary);

    // The dev server settles the component stylesheet and the theme swap
    // asynchronously, so wait for the fill rather than reading it once.
    await expect.poll(() => getComputedStyle(current).backgroundColor).toBe(primary);
    expect(getComputedStyle(current).color).toBe(onPrimary);
  }
  document.documentElement.removeAttribute('data-theme');
});

test('preserves nav props, styles, refs, and native events', async () => {
  const ref = createRef<HTMLElement>();
  const onClick = vi.fn((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  });
  await render(
    <TRPagination
      className="consumer-pagination"
      currentPage={2}
      data-testid="pagination"
      hrefFor={hrefFor}
      onClick={onClick}
      ref={ref}
      style={{ marginBlockStart: '7px' }}
      totalPages={5}
    />,
  );

  const nav = document.querySelector<HTMLElement>('[data-testid="pagination"]');
  expect(ref.current).toBe(nav);
  expect(nav).toHaveClass('tr-pagination', 'consumer-pagination');
  expect(nav?.style.marginBlockStart).toBe('7px');
  await userEvent.click(nav?.querySelector('a') as HTMLAnchorElement);
  expect(onClick).toHaveBeenCalledOnce();
});

test('server renders and hydrates without a mismatch', async () => {
  const fixture = <TRPagination currentPage={10} hrefFor={hrefFor} totalPages={20} />;
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  let root: ReturnType<typeof hydrateRoot> | undefined;

  await act(async () => {
    root = hydrateRoot(host, fixture);
  });
  // Two steps, two boundaries, two ellipses, and the three-page window.
  expect(host.querySelectorAll('.tr-pagination-item')).toHaveLength(9);
  expect(
    consoleError.mock.calls.some((call) => String(call[0]).includes('hydration')),
  ).toBe(false);
  await act(async () => root?.unmount());
  host.remove();
  consoleError.mockRestore();
});
