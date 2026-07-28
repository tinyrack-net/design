/**
 * Document path/URL helpers, split out of the authoring schema so `docs-config`
 * stays a pure public contract. `canonicalDocumentPath` is re-exported publicly
 * through `@tinyrack/docs/config`; the normalizers are internal.
 */
export function normalizeDocumentPathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized.length === 0 ? '/' : normalized;
}

export function canonicalDocumentPath(pathname: string) {
  const normalized = normalizeDocumentPathname(pathname);
  return normalized === '/' ? '/' : `${normalized}/`;
}

export function normalizeBasePath(basePath = '/') {
  const normalized = normalizeDocumentPathname(
    basePath.startsWith('/') ? basePath : `/${basePath}`,
  );
  return normalized === '/' ? '/' : normalized;
}
