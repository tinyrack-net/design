import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import { TRBreadcrumbs as UiBreadcrumbs } from '@tinyrack/ui/components/breadcrumbs';
import { Link as RouterLink } from 'react-router';

export function TRBreadcrumbs({ pathname }: { pathname: string }) {
  const page = docsManifest.pages.find((candidate) => candidate.path === pathname);
  if (page === undefined || page.breadcrumbs.length === 0) return null;

  const lastIndex = page.breadcrumbs.length - 1;
  return (
    <UiBreadcrumbs
      items={page.breadcrumbs.map((crumb, index) => ({
        label: crumb.name,
        ...(index === lastIndex ? {} : { href: crumb.path }),
      }))}
      renderLink={(item) => <RouterLink to={item.href ?? '#'} />}
    />
  );
}
