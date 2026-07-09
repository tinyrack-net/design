import { forwardRef, type HTMLAttributes, type TableHTMLAttributes } from 'react';
import {
  type TableDensity,
  tableClassName,
  tableContainerClassName,
  tableContract,
} from './contract.js';

export type { TableDensity } from './contract.js';

export type TableContainerProps = HTMLAttributes<HTMLDivElement>;

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  density?: TableDensity;
  striped?: boolean;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  function TableContainer({ className, ...containerProps }, ref) {
    return (
      <div
        {...containerProps}
        className={mergeClassNames(tableContainerClassName, className)}
        ref={ref}
      />
    );
  },
);

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, density = tableContract.defaultDensity, striped = false, ...tableProps },
  ref,
) {
  return (
    <table
      {...tableProps}
      className={mergeClassNames(tableClassName, className)}
      data-density={density}
      data-striped={striped ? 'true' : undefined}
      ref={ref}
    />
  );
});
