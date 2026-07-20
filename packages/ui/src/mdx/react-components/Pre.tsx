import {
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';
import { TRCodeBlock } from '../../components/code-block/index.js';
import { languageFromClassName, mergeClassNames } from '../mdx-markup.js';
import { type MdxCodeElementProps, TinyrackMdxCode } from './Code.js';
import { textFromReactNode } from './react-node-text.js';

function isCodeElement(node: ReactNode): node is ReactElement<MdxCodeElementProps> {
  return (
    isValidElement<MdxCodeElementProps>(node) &&
    (node.type === 'code' || node.type === TinyrackMdxCode)
  );
}

export function TinyrackMdxPre({ children }: ComponentPropsWithoutRef<'pre'>) {
  if (!isCodeElement(children)) {
    return (
      <pre className="tr-code-block tr-mdx-code-block">
        <code>{children}</code>
      </pre>
    );
  }

  const code = textFromReactNode(children.props.children).replace(/\n$/, '');
  const language = languageFromClassName(children.props.className);

  if (language === undefined) {
    return (
      <TRCodeBlock
        className={mergeClassNames(children.props.className, 'tr-mdx-code-block')}
        code={code}
      />
    );
  }

  return (
    <TRCodeBlock
      className={mergeClassNames(children.props.className, 'tr-mdx-code-block')}
      code={code}
      language={language as BundledLanguage}
    />
  );
}
