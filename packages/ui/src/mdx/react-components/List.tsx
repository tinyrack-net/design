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
