import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import type { ComponentPropsWithoutRef } from 'react';
import { useLocation } from 'react-router';
import { DocumentPagination } from './document-pagination.tsx';
import { findDocsPage } from './document-seo.ts';

export function DocsMdxWrapper({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'article'>) {
  const location = useLocation();
  const page = findDocsPage(location.pathname, docsManifest);

  return (
    <article
      {...props}
      className={['tr-mdx', className].filter(Boolean).join(' ')}
      data-pagefind-body=""
    >
      {page === undefined ? null : (
        <header className="tr-docs-page-header">
          <h1 className="tr-mdx-h1" data-pagefind-meta="title">
            {page.title}
          </h1>
          <p className="tr-mdx-p tr-docs-page-description">{page.description}</p>
        </header>
      )}
      {children}
      <DocumentPagination pathname={location.pathname} />
    </article>
  );
}
