import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import { Link as RouterLink } from 'react-router';
import { TRDocumentPagination as UiDocumentPagination } from './document-pagination/document-pagination.tsx';
import { getDocumentPagination } from './document-pagination-state.ts';

export function TRDocumentPagination({ pathname }: { pathname: string }) {
  const { next, previous } = getDocumentPagination(pathname, docsManifest);
  const page = docsManifest.pages.find((candidate) => candidate.path === pathname);
  const locale = page?.locale ?? docsManifest.defaultLocale;
  const messages = docsManifest.locales[locale]?.messages;

  return (
    <UiDocumentPagination
      {...(next === undefined ? {} : { next: { ...next, label: next.sectionLabel } })}
      nextAriaLabel={messages?.nextDocument ?? 'Next document'}
      nextLabel={messages?.next ?? 'Next'}
      {...(previous === undefined
        ? {}
        : { previous: { ...previous, label: previous.sectionLabel } })}
      previousAriaLabel={messages?.previousDocument ?? 'Previous document'}
      previousLabel={messages?.previous ?? 'Previous'}
      renderLink={(destination, direction) => (
        <RouterLink data-document-pagination-link={direction} to={destination.path} />
      )}
    />
  );
}
