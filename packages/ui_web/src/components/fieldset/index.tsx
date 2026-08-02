import { TRFieldsetLegend } from './fieldset-legend.js';
import { TRFieldsetRoot } from './fieldset-root.js';

export const TRFieldset = {
  Root: TRFieldsetRoot,
  Legend: TRFieldsetLegend,
} as const;

export type {
  FieldsetLegendState as TRFieldsetLegendState,
  FieldsetRootState as TRFieldsetRootState,
} from '@base-ui/react/fieldset';
export type { TRFieldsetLegendProps } from './fieldset-legend.js';
export type { TRFieldsetRootProps } from './fieldset-root.js';
export { TRFieldsetLegend, TRFieldsetRoot };
