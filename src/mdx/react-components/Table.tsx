import type { ComponentPropsWithoutRef } from 'react';
import { Table, TableContainer } from '../../components/table/react.js';

export function TinyrackMdxTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <TableContainer>
      <Table density="compact" {...props} />
    </TableContainer>
  );
}
