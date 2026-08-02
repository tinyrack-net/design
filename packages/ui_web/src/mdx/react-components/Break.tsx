import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxBr({
  className,
  ...brProps
}: ComponentPropsWithoutRef<'br'>) {
  return <br className={mergeClassNames('tr-mdx-break', className)} {...brProps} />;
}
