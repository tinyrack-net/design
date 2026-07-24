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

// Resolve the host tag an element ultimately renders. Plain elements use their
// string type directly; MDX-mapped components (e.g. `ul` -> TinyrackMdxList) expose
// their underlying tag via an `mdxTag` marker so authored Markdown lists are still
// recognized when the docs MDX pipeline replaces host tags with components.
function elementTag(element: ReactElement): string | undefined {
  const { type } = element;
  if (typeof type === 'string') return type;
  if (typeof type === 'function' || typeof type === 'object') {
    return (type as { mdxTag?: string }).mdxTag;
  }
  return undefined;
}

function isElementOfType(element: ReactNode, type: string): element is ListElement {
  return isValidElement(element) && elementTag(element) === type;
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
    const normalizedName = textFromNode(name).trim();
    const isDirectory = nestedList !== undefined || normalizedName.endsWith('/');
    const isPlaceholder = normalizedName === '...' || normalizedName === '…';

    if (isDirectory) {
      return (
        <li key={child.key} className="tr-file-tree-directory">
          <details open>
            <summary>{name}</summary>
            <ul className="tr-file-tree">
              {nestedList ? (
                renderListItems(nestedList)
              ) : (
                <li aria-hidden="true" className="tr-file-tree-placeholder">
                  …
                </li>
              )}
            </ul>
          </details>
        </li>
      );
    }

    if (isPlaceholder) {
      return (
        <li aria-hidden="true" key={child.key} className="tr-file-tree-placeholder">
          {name}
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
