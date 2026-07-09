export const tableClassName = 'tr-table';
export const tableContainerClassName = 'tr-table-container';
export const tableDensities = ['compact', 'normal', 'comfortable'] as const;

export type TableDensity = (typeof tableDensities)[number];

export const tableContract = {
  defaultDensity: 'normal',
} as const satisfies {
  defaultDensity: TableDensity;
};
