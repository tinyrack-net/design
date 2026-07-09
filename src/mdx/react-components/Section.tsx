import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxSection({
  className,
  ...sectionProps
}: ComponentPropsWithoutRef<'section'>) {
  const isFootnotes =
    (
      sectionProps as ComponentPropsWithoutRef<'section'> & {
        'data-footnotes'?: unknown;
      }
    )['data-footnotes'] !== undefined;

  return (
    <section
      className={mergeClassNames(isFootnotes && 'tr-mdx-footnotes', className)}
      {...sectionProps}
    />
  );
}
