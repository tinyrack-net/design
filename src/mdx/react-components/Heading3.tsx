import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxH3({
  className,
  ...headingProps
}: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={mergeClassNames('tr-mdx-h3', className)} {...headingProps} />;
}
