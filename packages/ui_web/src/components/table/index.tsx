import { TRTableBody } from './table-body.js';
import { TRTableCaption } from './table-caption.js';
import { TRTableCell } from './table-cell.js';
import { TRTableFooter } from './table-footer.js';
import { TRTableHead } from './table-head.js';
import { TRTableHeader } from './table-header.js';
import { TRTableRoot } from './table-root.js';
import { TRTableRow } from './table-row.js';

export const TRTable = {
  Root: TRTableRoot,
  Caption: TRTableCaption,
  Header: TRTableHeader,
  Body: TRTableBody,
  Footer: TRTableFooter,
  Row: TRTableRow,
  Head: TRTableHead,
  Cell: TRTableCell,
} as const;

export type { TRTableBodyProps } from './table-body.js';
export type { TRTableCaptionProps } from './table-caption.js';
export type { TRTableCellProps } from './table-cell.js';
export type { TRTableFooterProps } from './table-footer.js';
export type { TRTableHeadProps } from './table-head.js';
export type { TRTableHeaderProps } from './table-header.js';
export type { TRTableDensity, TRTableRootProps } from './table-root.js';
export type { TRTableRowProps } from './table-row.js';
export {
  TRTableBody,
  TRTableCaption,
  TRTableCell,
  TRTableFooter,
  TRTableHead,
  TRTableHeader,
  TRTableRoot,
  TRTableRow,
};
