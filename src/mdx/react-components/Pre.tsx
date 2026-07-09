import {
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { CodeBlock } from '../../components/code-block/react.js';
import { languageFromClassName } from '../shared.js';
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
      <pre className="tr-code-block">
        <code>{children}</code>
      </pre>
    );
  }

  const code = textFromReactNode(children.props.children).replace(/\n$/, '');
  const language = languageFromClassName(children.props.className);

  if (language === undefined) {
    return <CodeBlock>{code}</CodeBlock>;
  }

  return children;
}
