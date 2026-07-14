import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxH6({
  className,
  ...headingProps
}: ComponentPropsWithoutRef<'h6'>) {
  return <h6 className={mergeClassNames('tr-mdx-h6', className)} {...headingProps} />;
}
