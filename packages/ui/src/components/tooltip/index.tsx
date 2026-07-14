import { TooltipArrow } from './tooltip-arrow.js';
import type { TooltipHandle as TooltipHandleType } from './tooltip-handle.js';
import { createTooltipHandle } from './tooltip-handle.js';
import { TooltipPopup } from './tooltip-popup.js';
import { TooltipPortal } from './tooltip-portal.js';
import { TooltipPositioner } from './tooltip-positioner.js';
import { TooltipProvider } from './tooltip-provider.js';
import { TooltipRoot } from './tooltip-root.js';
import { TooltipTrigger } from './tooltip-trigger.js';
import { TooltipViewport } from './tooltip-viewport.js';

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Positioner: TooltipPositioner,
  Popup: TooltipPopup,
  Arrow: TooltipArrow,
  Provider: TooltipProvider,
  Viewport: TooltipViewport,
  createHandle: createTooltipHandle as <Payload>() => TooltipHandleType<Payload>,
} as const;

export type {
  TooltipArrowState,
  TooltipPopupState,
  TooltipPortalState,
  TooltipPositionerState,
  TooltipProviderState,
  TooltipRootState,
  TooltipTriggerState,
  TooltipViewportState,
} from '@base-ui/react/tooltip';
export type { TooltipArrowProps } from './tooltip-arrow.js';
export type { TooltipHandle } from './tooltip-handle.js';
export type { TooltipPopupProps } from './tooltip-popup.js';
export type { TooltipPortalProps } from './tooltip-portal.js';
export type { TooltipPositionerProps } from './tooltip-positioner.js';
export type { TooltipProviderProps } from './tooltip-provider.js';
export type { TooltipRootProps } from './tooltip-root.js';
export type { TooltipTriggerProps } from './tooltip-trigger.js';
export type { TooltipViewportProps } from './tooltip-viewport.js';
export {
  createTooltipHandle,
  TooltipArrow,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipViewport,
};
