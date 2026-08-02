import { TRTooltipArrow } from './tooltip-arrow.js';
import type { TRTooltipHandle as TooltipHandleType } from './tooltip-handle.js';
import { createTooltipHandle } from './tooltip-handle.js';
import { TRTooltipPopup } from './tooltip-popup.js';
import { TRTooltipPortal } from './tooltip-portal.js';
import { TRTooltipPositioner } from './tooltip-positioner.js';
import { TRTooltipProvider } from './tooltip-provider.js';
import { TRTooltipRoot } from './tooltip-root.js';
import { TRTooltipTrigger } from './tooltip-trigger.js';
import { TRTooltipViewport } from './tooltip-viewport.js';

export const TRTooltip = {
  Root: TRTooltipRoot,
  Trigger: TRTooltipTrigger,
  Portal: TRTooltipPortal,
  Positioner: TRTooltipPositioner,
  Popup: TRTooltipPopup,
  Arrow: TRTooltipArrow,
  Provider: TRTooltipProvider,
  Viewport: TRTooltipViewport,
  createHandle: createTooltipHandle as <Payload>() => TooltipHandleType<Payload>,
} as const;

export type {
  TooltipArrowState as TRTooltipArrowState,
  TooltipPopupState as TRTooltipPopupState,
  TooltipPortalState as TRTooltipPortalState,
  TooltipPositionerState as TRTooltipPositionerState,
  TooltipProviderState as TRTooltipProviderState,
  TooltipRootState as TRTooltipRootState,
  TooltipTriggerState as TRTooltipTriggerState,
  TooltipViewportState as TRTooltipViewportState,
} from '@base-ui/react/tooltip';
export type { TRTooltipArrowProps } from './tooltip-arrow.js';
export type { TRTooltipHandle } from './tooltip-handle.js';
export type { TRTooltipPopupProps } from './tooltip-popup.js';
export type { TRTooltipPortalProps } from './tooltip-portal.js';
export type { TRTooltipPositionerProps } from './tooltip-positioner.js';
export type { TRTooltipProviderProps } from './tooltip-provider.js';
export type { TRTooltipRootProps } from './tooltip-root.js';
export type { TRTooltipTriggerProps } from './tooltip-trigger.js';
export type { TRTooltipViewportProps } from './tooltip-viewport.js';
export {
  createTooltipHandle,
  TRTooltipArrow,
  TRTooltipPopup,
  TRTooltipPortal,
  TRTooltipPositioner,
  TRTooltipProvider,
  TRTooltipRoot,
  TRTooltipTrigger,
  TRTooltipViewport,
};
