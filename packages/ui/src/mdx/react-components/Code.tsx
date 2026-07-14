import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';
import { Code } from '../../components/code/index.js';
import { CodeBlock } from '../../components/code-block/index.js';
import { languageFromClassName } from '../mdx-markup.js';
import { textFromReactNode } from './react-node-text.js';

export type MdxCodeElementProps = {
  children?: ReactNode;
  className?: string;
};

export function TinyrackMdxCode({
  children,
  className,
  ...codeProps
}: ComponentPropsWithoutRef<'code'>) {
  const language = languageFromClassName(className);

  if (language !== undefined) {
    return (
      <CodeBlock
        className="tr-mdx-code-block"
        code={textFromReactNode(children).replace(/\n$/, '')}
        language={language as BundledLanguage}
      />
    );
  }

  return (
    <Code className={className} {...codeProps}>
      {children}
    </Code>
  );
}
