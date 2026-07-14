import { DrawerBackdrop } from './drawer-backdrop.js';
import { DrawerClose } from './drawer-close.js';
import { DrawerContent } from './drawer-content.js';
import { DrawerDescription } from './drawer-description.js';
import type { DrawerHandle as DrawerHandleType } from './drawer-handle.js';
import { createDrawerHandle } from './drawer-handle.js';
import { DrawerIndent } from './drawer-indent.js';
import { DrawerIndentBackground } from './drawer-indent-background.js';
import { DrawerPopup } from './drawer-popup.js';
import { DrawerPortal } from './drawer-portal.js';
import { DrawerProvider } from './drawer-provider.js';
import { DrawerRoot } from './drawer-root.js';
import { DrawerSwipeArea } from './drawer-swipe-area.js';
import { DrawerTitle } from './drawer-title.js';
import { DrawerTrigger } from './drawer-trigger.js';
import { DrawerViewport } from './drawer-viewport.js';
import { DrawerVirtualKeyboardProvider } from './drawer-virtual-keyboard-provider.js';

export const Drawer = {
  Backdrop: DrawerBackdrop,
  Close: DrawerClose,
  Content: DrawerContent,
  Description: DrawerDescription,
  Indent: DrawerIndent,
  IndentBackground: DrawerIndentBackground,
  Popup: DrawerPopup,
  Portal: DrawerPortal,
  Provider: DrawerProvider,
  Root: DrawerRoot,
  SwipeArea: DrawerSwipeArea,
  Title: DrawerTitle,
  Trigger: DrawerTrigger,
  Viewport: DrawerViewport,
  VirtualKeyboardProvider: DrawerVirtualKeyboardProvider,
  createHandle: createDrawerHandle as <Payload>() => DrawerHandleType<Payload>,
} as const;

export type {
  DrawerBackdropState,
  DrawerCloseState,
  DrawerContentState,
  DrawerDescriptionState,
  DrawerIndentBackgroundState,
  DrawerIndentState,
  DrawerPopupState,
  DrawerPortalState,
  DrawerProviderState,
  DrawerRootState,
  DrawerSwipeAreaState,
  DrawerTitleState,
  DrawerTriggerState,
  DrawerViewportState,
  DrawerVirtualKeyboardProviderState,
} from '@base-ui/react/drawer';
export type { DrawerBackdropProps } from './drawer-backdrop.js';
export type { DrawerCloseProps } from './drawer-close.js';
export type { DrawerContentProps } from './drawer-content.js';
export type { DrawerDescriptionProps } from './drawer-description.js';
export type { DrawerHandle } from './drawer-handle.js';
export type { DrawerIndentProps } from './drawer-indent.js';
export type { DrawerIndentBackgroundProps } from './drawer-indent-background.js';
export type { DrawerPopupProps } from './drawer-popup.js';
export type { DrawerPortalProps } from './drawer-portal.js';
export type { DrawerProviderProps } from './drawer-provider.js';
export type { DrawerRootProps } from './drawer-root.js';
export type { DrawerSwipeAreaProps } from './drawer-swipe-area.js';
export type { DrawerTitleProps } from './drawer-title.js';
export type { DrawerTriggerProps } from './drawer-trigger.js';
export type { DrawerViewportProps } from './drawer-viewport.js';
export type { DrawerVirtualKeyboardProviderProps } from './drawer-virtual-keyboard-provider.js';
export {
  createDrawerHandle,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerPopup,
  DrawerPortal,
  DrawerProvider,
  DrawerRoot,
  DrawerSwipeArea,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
  DrawerVirtualKeyboardProvider,
};
