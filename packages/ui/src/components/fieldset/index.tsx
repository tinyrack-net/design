import { FieldsetLegend } from './fieldset-legend.js';
import { FieldsetRoot } from './fieldset-root.js';

export const Fieldset = {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
} as const;

export type {
  FieldsetLegendState,
  FieldsetRootState,
} from '@base-ui/react/fieldset';
export type { FieldsetLegendProps } from './fieldset-legend.js';
export type { FieldsetRootProps } from './fieldset-root.js';
export { FieldsetLegend, FieldsetRoot };
