import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';
import { TRCode } from '../../components/code/index.js';
import { TRCodeBlock } from '../../components/code-block/index.js';
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
      <TRCodeBlock
        className="tr-mdx-code-block"
        code={textFromReactNode(children).replace(/\n$/, '')}
        language={language as BundledLanguage}
      />
    );
  }

  return (
    <TRCode className={className} {...codeProps}>
      {children}
    </TRCode>
  );
}
