import { TRAlertActions } from './alert-actions.js';
import { TRAlertDescription } from './alert-description.js';
import { TRAlertRoot } from './alert-root.js';
import { TRAlertTitle } from './alert-title.js';

export const TRAlert = {
  Root: TRAlertRoot,
  Title: TRAlertTitle,
  Description: TRAlertDescription,
  Actions: TRAlertActions,
} as const;

export type { TRAlertActionsProps } from './alert-actions.js';
export type { TRAlertDescriptionProps } from './alert-description.js';
export type { TRAlertRootProps } from './alert-root.js';
export type { TRAlertTitleProps } from './alert-title.js';
export { TRAlertActions, TRAlertDescription, TRAlertRoot, TRAlertTitle };
