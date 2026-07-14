import { AlertActions } from './alert-actions.js';
import { AlertDescription } from './alert-description.js';
import { AlertRoot } from './alert-root.js';
import { AlertTitle } from './alert-title.js';

export const Alert = {
  Root: AlertRoot,
  Title: AlertTitle,
  Description: AlertDescription,
  Actions: AlertActions,
} as const;

export type { AlertActionsProps } from './alert-actions.js';
export type { AlertDescriptionProps } from './alert-description.js';
export type { AlertRootProps } from './alert-root.js';
export type { AlertTitleProps } from './alert-title.js';
export { AlertActions, AlertDescription, AlertRoot, AlertTitle };
