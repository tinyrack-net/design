import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';
import { Code } from '../../components/code/react.js';
import { ShikiCodeBlock } from '../../components/code-block/shiki-react.js';
import { languageFromClassName } from '../shared.js';
import { textFromReactNode } from './utils.js';

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
      <ShikiCodeBlock
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
