import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxStrong({
  className,
  ...strongProps
}: ComponentPropsWithoutRef<'strong'>) {
  return (
    <strong className={mergeClassNames('tr-mdx-strong', className)} {...strongProps} />
  );
}
