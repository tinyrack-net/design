import type { ComponentPropsWithoutRef } from 'react';
import { DocsPageFrame } from './docs-page/docs-page.tsx';

export function DocsMdxWrapper({
  actionData: _actionData,
  children,
  className,
  loaderData: _loaderData,
  matches: _matches,
  params: _params,
  ...props
}: ComponentPropsWithoutRef<'article'> & {
  actionData?: unknown;
  loaderData?: unknown;
  matches?: unknown;
  params?: unknown;
}) {
  return (
    <DocsPageFrame {...props} className={className}>
      {children}
    </DocsPageFrame>
  );
}
