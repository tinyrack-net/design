import { TRPagination } from '@tinyrack/ui/components/pagination';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type Args = {
  boundaryCount: number;
  currentPage: number;
  siblingCount: number;
  totalPages: number;
};

const hrefFor = (page: number) => (page === 1 ? '/blog/' : `/blog/page/${page}/`);

export const paginationBasicSource = `import '@tinyrack/ui/components/pagination.css';
import { TRPagination } from '@tinyrack/ui/components/pagination';

const hrefFor = (page: number) => (page === 1 ? '/blog/' : \`/blog/page/\${page}/\`);

export function PaginationExample() {
  return <TRPagination currentPage={3} hrefFor={hrefFor} totalPages={12} />;
}`;

export const paginationWindowSource = `import '@tinyrack/ui/components/pagination.css';
import { TRPagination } from '@tinyrack/ui/components/pagination';

const hrefFor = (page: number) => \`/results/\${page}/\`;

export function PaginationWideWindow() {
  return (
    <TRPagination
      boundaryCount={2}
      currentPage={25}
      hrefFor={hrefFor}
      siblingCount={2}
      totalPages={50}
    />
  );
}`;

export const paginationRouterSource = `import '@tinyrack/ui/components/pagination.css';
import { TRPagination } from '@tinyrack/ui/components/pagination';
import { Link } from 'react-router';

const hrefFor = (page: number) => (page === 1 ? '/blog/' : \`/blog/page/\${page}/\`);

export function PaginationWithRouter({ currentPage, totalPages }) {
  return (
    <TRPagination
      currentPage={currentPage}
      hrefFor={hrefFor}
      label="Blog pagination"
      renderLink={(page) => <Link to={hrefFor(page)} />}
      totalPages={totalPages}
    />
  );
}`;

const labels = {
  en: {
    label: 'Pagination',
    next: 'Next',
    page: (page: number) => `Page ${page}`,
    previous: 'Previous',
  },
  ja: {
    label: 'ページ送り',
    next: '次へ',
    page: (page: number) => `${page}ページ`,
    previous: '前へ',
  },
  ko: {
    label: '페이지 매김',
    next: '다음',
    page: (page: number) => `${page}페이지`,
    previous: '이전',
  },
} as const;

export function PaginationPreview({
  boundaryCount,
  currentPage,
  siblingCount,
  totalPages,
}: Args) {
  const locale = useDemoLocale();
  const copy = labels[locale as keyof typeof labels] ?? labels.en;
  const [page, setPage] = useState(currentPage);
  const active = Math.min(Math.max(page, 1), totalPages);

  return (
    <TRPagination
      boundaryCount={boundaryCount}
      currentPage={active}
      data-docs-example-item=""
      hrefFor={hrefFor}
      label={copy.label}
      nextLabel={copy.next}
      pageLabel={copy.page}
      previousLabel={copy.previous}
      // The cells stay real links so keyboard activation still works; the demo
      // just intercepts the click instead of leaving the documentation site.
      onClick={(event) => {
        const link = (event.target as HTMLElement).closest('[data-demo-page]');
        if (link === null) return;
        event.preventDefault();
        setPage(Number(link.getAttribute('data-demo-page')));
      }}
      renderLink={(target) => (
        // biome-ignore lint/a11y/useAnchorContent: Base UI injects the link content into this router slot.
        // biome-ignore lint/a11y/useValidAnchor: Base UI injects the href into this router slot.
        <a data-demo-page={target} />
      )}
      siblingCount={siblingCount}
      totalPages={totalPages}
    />
  );
}

export function PaginationWideWindowPreview() {
  return (
    <PaginationPreview
      boundaryCount={2}
      currentPage={25}
      siblingCount={2}
      totalPages={50}
    />
  );
}

const meta = {
  args: { boundaryCount: 1, currentPage: 3, siblingCount: 1, totalPages: 12 },
  argTypes: {
    boundaryCount: { control: 'number' },
    currentPage: { control: 'number' },
    siblingCount: { control: 'number' },
    totalPages: { control: 'number' },
  },
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  render: PaginationPreview,
  title: 'Components/Pagination',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
