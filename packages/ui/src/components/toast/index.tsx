import { ToastAction } from './toast-action.js';
import { ToastArrow } from './toast-arrow.js';
import { ToastClose } from './toast-close.js';
import { ToastContent } from './toast-content.js';
import { ToastDescription } from './toast-description.js';
import { createToastManager, useToastManager } from './toast-manager.js';
import { ToastPortal } from './toast-portal.js';
import { ToastPositioner } from './toast-positioner.js';
import { ToastProvider } from './toast-provider.js';
import { ToastRoot } from './toast-root.js';
import { ToastTitle } from './toast-title.js';
import { ToastViewport } from './toast-viewport.js';

export const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Content: ToastContent,
  Description: ToastDescription,
  Title: ToastTitle,
  Close: ToastClose,
  Action: ToastAction,
  Portal: ToastPortal,
  Positioner: ToastPositioner,
  Arrow: ToastArrow,
  createToastManager,
  useToastManager,
} as const;

export type {
  ToastActionState,
  ToastArrowState,
  ToastCloseState,
  ToastContentState,
  ToastDescriptionState,
  ToastPortalState,
  ToastPositionerState,
  ToastProviderState,
  ToastRootState,
  ToastTitleState,
  ToastViewportState,
} from '@base-ui/react/toast';
export type { ToastActionProps } from './toast-action.js';
export type { ToastArrowProps } from './toast-arrow.js';
export type { ToastCloseProps } from './toast-close.js';
export type { ToastContentProps } from './toast-content.js';
export type { ToastDescriptionProps } from './toast-description.js';
export type { ToastPortalProps } from './toast-portal.js';
export type { ToastPositionerProps } from './toast-positioner.js';
export type { ToastProviderProps } from './toast-provider.js';
export type { ToastRootProps, ToastVariant } from './toast-root.js';
export type { ToastTitleProps } from './toast-title.js';
export type { ToastPosition, ToastViewportProps } from './toast-viewport.js';
export {
  createToastManager,
  ToastAction,
  ToastArrow,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastPositioner,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  useToastManager,
};
