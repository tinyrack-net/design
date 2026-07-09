import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxBlockquote({
  className,
  ...quoteProps
}: ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote
      className={mergeClassNames('tr-mdx-blockquote', className)}
      {...quoteProps}
    />
  );
}
