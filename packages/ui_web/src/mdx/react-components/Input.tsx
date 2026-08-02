import type { ComponentPropsWithoutRef } from 'react';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxInput({
  className,
  type,
  ...inputProps
}: ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      {...inputProps}
      className={mergeClassNames(
        type === 'checkbox' ? 'tr-mdx-task-checkbox' : undefined,
        className,
      )}
      type={type}
    />
  );
}
