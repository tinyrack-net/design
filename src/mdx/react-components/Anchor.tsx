import type { ComponentPropsWithoutRef } from 'react';
import { Link } from '../../components/link/react.js';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxAnchor({
  className,
  ...anchorProps
}: ComponentPropsWithoutRef<'a'>) {
  return (
    <Link
      className={mergeClassNames('tr-mdx-link', className)}
      underline="always"
      variant="primary"
      {...anchorProps}
    />
  );
}
