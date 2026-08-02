import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

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

// See TinyrackMdxList: exposes the underlying host tag for structure-aware consumers.
TinyrackMdxOrderedList.mdxTag = 'ol';
