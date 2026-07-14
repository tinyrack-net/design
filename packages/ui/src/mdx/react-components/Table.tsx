import type { ComponentPropsWithoutRef } from 'react';
import { Table } from '../../components/table/index.js';
import { mergeClassNames } from '../mdx-markup.js';

export function TinyrackMdxTable({
  className,
  ...tableProps
}: ComponentPropsWithoutRef<'table'>) {
  return (
    <Table.Root
      {...tableProps}
      className={mergeClassNames('tr-mdx-table', className)}
      containerClassName="tr-mdx-table-container"
      density="compact"
    />
  );
}
