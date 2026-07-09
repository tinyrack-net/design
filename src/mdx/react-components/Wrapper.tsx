import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxWrapper({
  children,
  className,
  ...wrapperProps
}: ComponentPropsWithoutRef<'main'>) {
  return (
    <main {...wrapperProps} className={mergeClassNames('tr-mdx', className)}>
      {children}
    </main>
  );
}
