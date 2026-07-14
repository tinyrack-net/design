import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxParagraph({
  className,
  ...paragraphProps
}: ComponentPropsWithoutRef<'p'>) {
  return <p className={mergeClassNames('tr-mdx-p', className)} {...paragraphProps} />;
}
