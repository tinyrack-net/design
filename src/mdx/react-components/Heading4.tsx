import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxH4({
  className,
  ...headingProps
}: ComponentPropsWithoutRef<'h4'>) {
  return <h4 className={mergeClassNames('tr-mdx-h4', className)} {...headingProps} />;
}
