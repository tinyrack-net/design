import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxSup({
  className,
  ...supProps
}: ComponentPropsWithoutRef<'sup'>) {
  return (
    <sup className={mergeClassNames('tr-mdx-footnote-ref', className)} {...supProps} />
  );
}
