import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxList({
  className,
  ...listProps
}: ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul
      className={mergeClassNames(
        'tr-mdx-list',
        className?.includes('contains-task-list') && 'tr-mdx-task-list',
        className,
      )}
      {...listProps}
    />
  );
}

// Lets structure-aware consumers (e.g. TRFileTree) recognize this as a `ul`
// even though the MDX pipeline maps `ul` to this component instead of the host tag.
TinyrackMdxList.mdxTag = 'ul';
