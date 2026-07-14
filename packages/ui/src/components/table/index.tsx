import { TableBody } from './table-body.js';
import { TableCaption } from './table-caption.js';
import { TableCell } from './table-cell.js';
import { TableFooter } from './table-footer.js';
import { TableHead } from './table-head.js';
import { TableHeader } from './table-header.js';
import { TableRoot } from './table-root.js';
import { TableRow } from './table-row.js';

export const Table = {
  Root: TableRoot,
  Caption: TableCaption,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
} as const;

export type { TableBodyProps } from './table-body.js';
export type { TableCaptionProps } from './table-caption.js';
export type { TableCellProps } from './table-cell.js';
export type { TableFooterProps } from './table-footer.js';
export type { TableHeadProps } from './table-head.js';
export type { TableHeaderProps } from './table-header.js';
export type { TableDensity, TableRootProps } from './table-root.js';
export type { TableRowProps } from './table-row.js';
export {
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
};
