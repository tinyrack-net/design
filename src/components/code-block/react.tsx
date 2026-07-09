import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { codeBlockClassName } from './contract.js';

export type CodeBlockProps = Omit<HTMLAttributes<HTMLPreElement>, 'children'> & {
  children: ReactNode;
  language?: string;
  wrap?: boolean;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(function CodeBlock(
  { children, className, language, wrap = false, ...preProps },
  ref,
) {
  return (
    <pre
      {...preProps}
      className={mergeClassNames(codeBlockClassName, className)}
      data-language={language}
      data-wrap={wrap ? 'true' : undefined}
      ref={ref}
    >
      <code>{children}</code>
    </pre>
  );
});
