import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxHr({
  className,
  ...hrProps
}: ComponentPropsWithoutRef<'hr'>) {
  return <hr className={mergeClassNames('tr-mdx-rule', className)} {...hrProps} />;
}
