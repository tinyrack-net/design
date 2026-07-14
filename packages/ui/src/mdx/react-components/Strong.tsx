import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxStrong({
  className,
  ...strongProps
}: ComponentPropsWithoutRef<'strong'>) {
  return (
    <strong className={mergeClassNames('tr-mdx-strong', className)} {...strongProps} />
  );
}
