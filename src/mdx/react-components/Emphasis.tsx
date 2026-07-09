import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxEm({
  className,
  ...emProps
}: ComponentPropsWithoutRef<'em'>) {
  return <em className={mergeClassNames('tr-mdx-em', className)} {...emProps} />;
}
