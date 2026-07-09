import type { ComponentPropsWithoutRef } from 'react';
import { Table, TableContainer } from '../../components/table/react.js';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxTable({
  className,
  ...tableProps
}: ComponentPropsWithoutRef<'table'>) {
  return (
    <TableContainer className="tr-mdx-table-container">
      <Table
        {...tableProps}
        className={mergeClassNames('tr-mdx-table', className)}
        density="normal"
      />
    </TableContainer>
  );
}
