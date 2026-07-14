import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

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
