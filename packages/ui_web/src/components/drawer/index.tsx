import { TRDrawerBackdrop } from './drawer-backdrop.js';
import { TRDrawerClose } from './drawer-close.js';
import { TRDrawerContent } from './drawer-content.js';
import { TRDrawerDescription } from './drawer-description.js';
import type { TRDrawerHandle as DrawerHandleType } from './drawer-handle.js';
import { createDrawerHandle } from './drawer-handle.js';
import { TRDrawerIndent } from './drawer-indent.js';
import { TRDrawerIndentBackground } from './drawer-indent-background.js';
import { TRDrawerPopup } from './drawer-popup.js';
import { TRDrawerPortal } from './drawer-portal.js';
import { TRDrawerProvider } from './drawer-provider.js';
import { TRDrawerRoot } from './drawer-root.js';
import { TRDrawerSwipeArea } from './drawer-swipe-area.js';
import { TRDrawerTitle } from './drawer-title.js';
import { TRDrawerTrigger } from './drawer-trigger.js';
import { TRDrawerViewport } from './drawer-viewport.js';
import { TRDrawerVirtualKeyboardProvider } from './drawer-virtual-keyboard-provider.js';

export const TRDrawer = {
  Backdrop: TRDrawerBackdrop,
  Close: TRDrawerClose,
  Content: TRDrawerContent,
  Description: TRDrawerDescription,
  Indent: TRDrawerIndent,
  IndentBackground: TRDrawerIndentBackground,
  Popup: TRDrawerPopup,
  Portal: TRDrawerPortal,
  Provider: TRDrawerProvider,
  Root: TRDrawerRoot,
  SwipeArea: TRDrawerSwipeArea,
  Title: TRDrawerTitle,
  Trigger: TRDrawerTrigger,
  Viewport: TRDrawerViewport,
  VirtualKeyboardProvider: TRDrawerVirtualKeyboardProvider,
  createHandle: createDrawerHandle as <Payload>() => DrawerHandleType<Payload>,
} as const;

export type {
  DrawerBackdropState as TRDrawerBackdropState,
  DrawerCloseState as TRDrawerCloseState,
  DrawerContentState as TRDrawerContentState,
  DrawerDescriptionState as TRDrawerDescriptionState,
  DrawerIndentBackgroundState as TRDrawerIndentBackgroundState,
  DrawerIndentState as TRDrawerIndentState,
  DrawerPopupState as TRDrawerPopupState,
  DrawerPortalState as TRDrawerPortalState,
  DrawerProviderState as TRDrawerProviderState,
  DrawerRootState as TRDrawerRootState,
  DrawerSwipeAreaState as TRDrawerSwipeAreaState,
  DrawerTitleState as TRDrawerTitleState,
  DrawerTriggerState as TRDrawerTriggerState,
  DrawerViewportState as TRDrawerViewportState,
  DrawerVirtualKeyboardProviderState as TRDrawerVirtualKeyboardProviderState,
} from '@base-ui/react/drawer';
export type { TRDrawerBackdropProps } from './drawer-backdrop.js';
export type { TRDrawerCloseProps } from './drawer-close.js';
export type { TRDrawerContentProps } from './drawer-content.js';
export type { TRDrawerDescriptionProps } from './drawer-description.js';
export type { TRDrawerHandle } from './drawer-handle.js';
export type { TRDrawerIndentProps } from './drawer-indent.js';
export type { TRDrawerIndentBackgroundProps } from './drawer-indent-background.js';
export type { TRDrawerPopupProps } from './drawer-popup.js';
export type { TRDrawerPortalProps } from './drawer-portal.js';
export type { TRDrawerProviderProps } from './drawer-provider.js';
export type { TRDrawerRootProps } from './drawer-root.js';
export type { TRDrawerSwipeAreaProps } from './drawer-swipe-area.js';
export type { TRDrawerTitleProps } from './drawer-title.js';
export type { TRDrawerTriggerProps } from './drawer-trigger.js';
export type { TRDrawerViewportProps } from './drawer-viewport.js';
export type { TRDrawerVirtualKeyboardProviderProps } from './drawer-virtual-keyboard-provider.js';
export {
  createDrawerHandle,
  TRDrawerBackdrop,
  TRDrawerClose,
  TRDrawerContent,
  TRDrawerDescription,
  TRDrawerIndent,
  TRDrawerIndentBackground,
  TRDrawerPopup,
  TRDrawerPortal,
  TRDrawerProvider,
  TRDrawerRoot,
  TRDrawerSwipeArea,
  TRDrawerTitle,
  TRDrawerTrigger,
  TRDrawerViewport,
  TRDrawerVirtualKeyboardProvider,
};
