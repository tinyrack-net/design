import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxOrderedList({
  className,
  ...listProps
}: ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol
      className={mergeClassNames('tr-mdx-list tr-mdx-ordered-list', className)}
      {...listProps}
    />
  );
}
