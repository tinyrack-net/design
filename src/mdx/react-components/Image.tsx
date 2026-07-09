import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxImg({
  className,
  ...imageProps
}: ComponentPropsWithoutRef<'img'>) {
  return (
    <img
      alt=""
      {...imageProps}
      className={mergeClassNames('tr-mdx-image', className)}
    />
  );
}
