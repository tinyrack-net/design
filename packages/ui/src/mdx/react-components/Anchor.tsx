import type { ComponentPropsWithoutRef } from 'react';
import { TRLink } from '../../components/link/index.js';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxAnchor({
  className,
  ...anchorProps
}: ComponentPropsWithoutRef<'a'>) {
  return (
    <TRLink
      className={mergeClassNames('tr-mdx-link', className)}
      underline="always"
      variant="default"
      {...anchorProps}
    />
  );
}
