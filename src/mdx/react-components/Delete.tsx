import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxDel({
  className,
  ...delProps
}: ComponentPropsWithoutRef<'del'>) {
  return <del className={mergeClassNames('tr-mdx-del', className)} {...delProps} />;
}
