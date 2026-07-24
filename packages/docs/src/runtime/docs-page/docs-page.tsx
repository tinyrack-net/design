import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import type { ComponentProps } from 'react';
import { useLocation } from 'react-router';
import type { DocsFrontmatter, DocsHeading } from '../../config/docs-config.ts';
import { TRBreadcrumbs } from '../breadcrumbs.tsx';
import { TRDocumentPagination } from '../document-pagination.tsx';
import { findDocsPage } from '../document-seo.ts';

export type DocsPageProps = ComponentProps<'article'> & {
  frontmatter: DocsFrontmatter;
  headings?: readonly DocsHeading[];
};

export function DocsPageFrame({
  children,
  className,
  ...props
}: ComponentProps<'article'>) {
  const location = useLocation();
  const page = findDocsPage(location.pathname, docsManifest);

  return (
    <article
      {...props}
      className={['tr-mdx', className].filter(Boolean).join(' ')}
      data-pagefind-body=""
      data-pagefind-filter={page === undefined ? undefined : `locale:${page.locale}`}
    >
      {page === undefined || page.layout !== 'docs' ? null : (
        <header className="tr-docs-page-header">
          <TRBreadcrumbs pathname={page.path} />
          <h1 className="tr-mdx-h1" data-pagefind-meta="title">
            {page.title}
          </h1>
          <p className="tr-mdx-p tr-docs-page-description">{page.description}</p>
        </header>
      )}
      {children}
      {page?.layout === 'docs' && page.navigation ? (
        <TRDocumentPagination pathname={page.path} />
      ) : null}
    </article>
  );
}

export function DocsPage({
  frontmatter: _frontmatter,
  headings: _headings,
  ...props
}: DocsPageProps) {
  return <DocsPageFrame {...props} />;
}
