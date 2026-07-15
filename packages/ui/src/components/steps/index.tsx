import { StepsItem, StepsRoot } from './steps.js';

export const Steps = { Item: StepsItem, Root: StepsRoot } as const;
export type { StepsItemProps, StepsRootProps } from './steps.js';
export { StepsItem, StepsRoot };
