import { TRToastAction } from './toast-action.js';
import { TRToastArrow } from './toast-arrow.js';
import { TRToastClose } from './toast-close.js';
import { TRToastContent } from './toast-content.js';
import { TRToastDescription } from './toast-description.js';
import { createToastManager, useToastManager } from './toast-manager.js';
import { TRToastPortal } from './toast-portal.js';
import { TRToastPositioner } from './toast-positioner.js';
import { TRToastProvider } from './toast-provider.js';
import { TRToastRoot } from './toast-root.js';
import { TRToastTitle } from './toast-title.js';
import { TRToastViewport } from './toast-viewport.js';

export const TRToast = {
  Provider: TRToastProvider,
  Viewport: TRToastViewport,
  Root: TRToastRoot,
  Content: TRToastContent,
  Description: TRToastDescription,
  Title: TRToastTitle,
  Close: TRToastClose,
  Action: TRToastAction,
  Portal: TRToastPortal,
  Positioner: TRToastPositioner,
  Arrow: TRToastArrow,
  createToastManager,
  useToastManager,
} as const;

export type {
  ToastActionState as TRToastActionState,
  ToastArrowState as TRToastArrowState,
  ToastCloseState as TRToastCloseState,
  ToastContentState as TRToastContentState,
  ToastDescriptionState as TRToastDescriptionState,
  ToastPortalState as TRToastPortalState,
  ToastPositionerState as TRToastPositionerState,
  ToastProviderState as TRToastProviderState,
  ToastRootState as TRToastRootState,
  ToastTitleState as TRToastTitleState,
  ToastViewportState as TRToastViewportState,
} from '@base-ui/react/toast';
export type { TRToastActionProps } from './toast-action.js';
export type { TRToastArrowProps } from './toast-arrow.js';
export type { TRToastCloseProps } from './toast-close.js';
export type { TRToastContentProps } from './toast-content.js';
export type { TRToastDescriptionProps } from './toast-description.js';
export type { TRToastPortalProps } from './toast-portal.js';
export type { TRToastPositionerProps } from './toast-positioner.js';
export type { TRToastProviderProps } from './toast-provider.js';
export type { TRToastRootProps, TRToastVariant } from './toast-root.js';
export type { TRToastTitleProps } from './toast-title.js';
export type { TRToastPosition, TRToastViewportProps } from './toast-viewport.js';
export {
  createToastManager,
  TRToastAction,
  TRToastArrow,
  TRToastClose,
  TRToastContent,
  TRToastDescription,
  TRToastPortal,
  TRToastPositioner,
  TRToastProvider,
  TRToastRoot,
  TRToastTitle,
  TRToastViewport,
  useToastManager,
};
