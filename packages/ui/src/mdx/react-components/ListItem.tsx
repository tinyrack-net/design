import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxListItem({
  className,
  ...itemProps
}: ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      className={mergeClassNames(
        'tr-mdx-li',
        className?.includes('task-list-item') && 'tr-mdx-task-item',
        className,
      )}
      {...itemProps}
    />
  );
}
