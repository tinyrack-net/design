import { forwardRef, type HTMLAttributes } from 'react';
import { codeClassName } from './contract.js';

export type CodeProps = HTMLAttributes<HTMLElement>;

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { className, ...codeProps },
  ref,
) {
  return (
    <code
      {...codeProps}
      className={mergeClassNames(codeClassName, className)}
      ref={ref}
    />
  );
});
