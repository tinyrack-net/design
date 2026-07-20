import {
  Children,
  type ComponentPropsWithRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

type ListElement = ReactElement<{ children?: ReactNode }>;

export type TRFileTreeProps = Omit<ComponentPropsWithRef<'ul'>, 'children'> & {
  children: ReactNode;
};

function isElementOfType(element: ReactNode, type: string): element is ListElement {
  return isValidElement(element) && element.type === type;
}

function getListChildren(element: ListElement): ReactNode[] {
  return Children.toArray(element.props.children);
}

function textFromNode(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textFromNode(node.props.children);
  }
  return '';
}

function findNestedList(children: ReactNode[]): ListElement | undefined {
  for (const child of children) {
    if (isElementOfType(child, 'ul')) return child;
  }
  return undefined;
}

function getEntryContent(children: ReactNode[], nestedList?: ListElement): ReactNode {
  const content = children.filter((child) => child !== nestedList);
  if (content.length === 1 && isElementOfType(content[0], 'p')) {
    return content[0].props.children;
  }
  return content;
}

function renderListItems(list: ListElement): ReactNode[] {
  return getListChildren(list).flatMap((child) => {
    if (!isElementOfType(child, 'li')) return [];

    const itemChildren = getListChildren(child);
    const nestedList = findNestedList(itemChildren);
    const name = getEntryContent(itemChildren, nestedList);
    const isDirectory =
      nestedList !== undefined || textFromNode(name).trim().endsWith('/');

    if (isDirectory) {
      return (
        <li key={child.key} className="tr-file-tree-directory">
          <details open>
            <summary>{name}</summary>
            <ul className="tr-file-tree">
              {nestedList ? (
                renderListItems(nestedList)
              ) : (
                <li className="tr-file-tree-file">…</li>
              )}
            </ul>
          </details>
        </li>
      );
    }

    return (
      <li key={child.key} className="tr-file-tree-file">
        {name}
      </li>
    );
  });
}

export function TRFileTree({ children, className, ...props }: TRFileTreeProps) {
  const sourceList = Children.toArray(children).find((child) =>
    isElementOfType(child, 'ul'),
  );

  return (
    <ul {...props} className={mergeClassNames('tr-file-tree', className)}>
      {sourceList ? renderListItems(sourceList) : children}
    </ul>
  );
}
