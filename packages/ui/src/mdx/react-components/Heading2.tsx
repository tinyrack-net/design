import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxH2({
  className,
  ...headingProps
}: ComponentPropsWithoutRef<'h2'>) {
  return <h2 className={mergeClassNames('tr-mdx-h2', className)} {...headingProps} />;
}
