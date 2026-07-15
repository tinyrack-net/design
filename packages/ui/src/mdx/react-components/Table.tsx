import {
  Children,
  type ComponentPropsWithoutRef,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Table } from '../../components/table/index.js';
import { mergeClassNames } from '../mdx-markup.js';
import { textFromReactNode } from './react-node-text.js';

type ElementWithChildren = ReactElement<{ children?: ReactNode }>;

function elements(children: ReactNode) {
  return Children.toArray(children).filter(isValidElement) as ElementWithChildren[];
}

function contractTable(children: ReactNode) {
  const sections = elements(children);
  const headerRow = elements(sections[0]?.props.children)[0];
  const labels = elements(headerRow?.props.children).map((cell) =>
    textFromReactNode(cell.props.children).trim(),
  );
  const isContract = /^(Axis|Concern|Part)$/.test(labels[0] ?? '');

  if (!isContract) return { children, isContract, labels };

  return {
    isContract,
    labels,
    children: Children.map(children, (section, sectionIndex) => {
      if (!isValidElement<{ children?: ReactNode }>(section) || sectionIndex === 0) {
        return section;
      }
      return cloneElement(section, {
        children: Children.map(section.props.children, (row) => {
          if (!isValidElement<{ children?: ReactNode }>(row)) return row;
          return cloneElement(row, {
            children: Children.map(row.props.children, (cell, cellIndex) => {
              if (!isValidElement<{ children?: ReactNode }>(cell)) return cell;
              return cloneElement(
                cell as ReactElement<Record<string, unknown>>,
                { 'data-contract-label': labels[cellIndex] },
                <span className="tr-mdx-contract-value">{cell.props.children}</span>,
              );
            }),
          });
        }),
      });
    }),
  };
}

export function TinyrackMdxTable({
  children,
  className,
  ...tableProps
}: ComponentPropsWithoutRef<'table'>) {
  const contract = contractTable(children);
  return (
    <Table.Root
      {...tableProps}
      className={mergeClassNames('tr-mdx-table', className)}
      containerClassName="tr-mdx-table-container"
      data-contract-table={contract.isContract ? '' : undefined}
      density="compact"
    >
      {contract.children}
    </Table.Root>
  );
}
