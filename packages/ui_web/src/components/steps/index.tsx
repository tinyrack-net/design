import { TRStepsItem, TRStepsRoot } from './steps.js';

export const TRSteps = { Item: TRStepsItem, Root: TRStepsRoot } as const;
export type { TRStepsItemProps, TRStepsRootProps } from './steps.js';
export { TRStepsItem, TRStepsRoot };
