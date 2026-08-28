import { TRStepsItem, TRStepsProgress, TRStepsRoot } from './steps.js';

export const TRSteps = {
  Item: TRStepsItem,
  Progress: TRStepsProgress,
  Root: TRStepsRoot,
} as const;
export type {
  TRStepsItemProps,
  TRStepsProgressProps,
  TRStepsRootProps,
} from './steps.js';
export { TRStepsItem, TRStepsProgress, TRStepsRoot };
