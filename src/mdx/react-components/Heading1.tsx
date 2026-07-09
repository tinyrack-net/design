import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxH1({
  className,
  ...headingProps
}: ComponentPropsWithoutRef<'h1'>) {
  return <h1 className={mergeClassNames('tr-mdx-h1', className)} {...headingProps} />;
}
