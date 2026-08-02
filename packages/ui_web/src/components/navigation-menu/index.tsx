import { TRNavigationMenuArrow } from './navigation-menu-arrow.js';
import { TRNavigationMenuBackdrop } from './navigation-menu-backdrop.js';
import { TRNavigationMenuContent } from './navigation-menu-content.js';
import { TRNavigationMenuIcon } from './navigation-menu-icon.js';
import { TRNavigationMenuItem } from './navigation-menu-item.js';
import { TRNavigationMenuLink } from './navigation-menu-link.js';
import { TRNavigationMenuList } from './navigation-menu-list.js';
import { TRNavigationMenuPopup } from './navigation-menu-popup.js';
import { TRNavigationMenuPortal } from './navigation-menu-portal.js';
import { TRNavigationMenuPositioner } from './navigation-menu-positioner.js';
import { TRNavigationMenuRoot } from './navigation-menu-root.js';
import { TRNavigationMenuTrigger } from './navigation-menu-trigger.js';
import { TRNavigationMenuViewport } from './navigation-menu-viewport.js';

export const TRNavigationMenu = {
  Root: TRNavigationMenuRoot,
  List: TRNavigationMenuList,
  Item: TRNavigationMenuItem,
  Content: TRNavigationMenuContent,
  Trigger: TRNavigationMenuTrigger,
  Portal: TRNavigationMenuPortal,
  Positioner: TRNavigationMenuPositioner,
  Viewport: TRNavigationMenuViewport,
  Backdrop: TRNavigationMenuBackdrop,
  Popup: TRNavigationMenuPopup,
  Arrow: TRNavigationMenuArrow,
  Link: TRNavigationMenuLink,
  Icon: TRNavigationMenuIcon,
} as const;

export type {
  NavigationMenuArrowState as TRNavigationMenuArrowState,
  NavigationMenuBackdropState as TRNavigationMenuBackdropState,
  NavigationMenuContentState as TRNavigationMenuContentState,
  NavigationMenuIconState as TRNavigationMenuIconState,
  NavigationMenuItemState as TRNavigationMenuItemState,
  NavigationMenuLinkState as TRNavigationMenuLinkState,
  NavigationMenuListState as TRNavigationMenuListState,
  NavigationMenuPopupState as TRNavigationMenuPopupState,
  NavigationMenuPortalState as TRNavigationMenuPortalState,
  NavigationMenuPositionerState as TRNavigationMenuPositionerState,
  NavigationMenuRootState as TRNavigationMenuRootState,
  NavigationMenuTriggerState as TRNavigationMenuTriggerState,
  NavigationMenuViewportState as TRNavigationMenuViewportState,
} from '@base-ui/react/navigation-menu';
export type { TRNavigationMenuArrowProps } from './navigation-menu-arrow.js';
export type { TRNavigationMenuBackdropProps } from './navigation-menu-backdrop.js';
export type { TRNavigationMenuContentProps } from './navigation-menu-content.js';
export type { TRNavigationMenuIconProps } from './navigation-menu-icon.js';
export type { TRNavigationMenuItemProps } from './navigation-menu-item.js';
export type { TRNavigationMenuLinkProps } from './navigation-menu-link.js';
export type { TRNavigationMenuListProps } from './navigation-menu-list.js';
export type { TRNavigationMenuPopupProps } from './navigation-menu-popup.js';
export type { TRNavigationMenuPortalProps } from './navigation-menu-portal.js';
export type { TRNavigationMenuPositionerProps } from './navigation-menu-positioner.js';
export type { TRNavigationMenuRootProps } from './navigation-menu-root.js';
export type { TRNavigationMenuTriggerProps } from './navigation-menu-trigger.js';
export type { TRNavigationMenuViewportProps } from './navigation-menu-viewport.js';
export {
  TRNavigationMenuArrow,
  TRNavigationMenuBackdrop,
  TRNavigationMenuContent,
  TRNavigationMenuIcon,
  TRNavigationMenuItem,
  TRNavigationMenuLink,
  TRNavigationMenuList,
  TRNavigationMenuPopup,
  TRNavigationMenuPortal,
  TRNavigationMenuPositioner,
  TRNavigationMenuRoot,
  TRNavigationMenuTrigger,
  TRNavigationMenuViewport,
};
