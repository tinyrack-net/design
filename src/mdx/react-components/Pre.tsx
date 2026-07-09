import {
  type ComponentPropsWithoutRef,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { CodeBlock } from '../../components/code-block/react.js';
import { languageFromClassName, mergeClassNames } from '../shared.js';
import { type MdxCodeElementProps, TinyrackMdxCode } from './Code.js';
import { textFromReactNode } from './utils.js';

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
    return <CodeBlock className="tr-mdx-code-block">{code}</CodeBlock>;
  }

  return cloneElement(children, {
    className: mergeClassNames(children.props.className, 'tr-mdx-code-block'),
  });
}
