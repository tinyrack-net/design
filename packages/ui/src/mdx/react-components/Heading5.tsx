import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxH5({
  className,
  ...headingProps
}: ComponentPropsWithoutRef<'h5'>) {
  return <h5 className={mergeClassNames('tr-mdx-h5', className)} {...headingProps} />;
}
