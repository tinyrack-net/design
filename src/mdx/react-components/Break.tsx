import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxBr({
  className,
  ...brProps
}: ComponentPropsWithoutRef<'br'>) {
  return <br className={mergeClassNames('tr-mdx-break', className)} {...brProps} />;
}
