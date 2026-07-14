import { NavigationMenuArrow } from './navigation-menu-arrow.js';
import { NavigationMenuBackdrop } from './navigation-menu-backdrop.js';
import { NavigationMenuContent } from './navigation-menu-content.js';
import { NavigationMenuIcon } from './navigation-menu-icon.js';
import { NavigationMenuItem } from './navigation-menu-item.js';
import { NavigationMenuLink } from './navigation-menu-link.js';
import { NavigationMenuList } from './navigation-menu-list.js';
import { NavigationMenuPopup } from './navigation-menu-popup.js';
import { NavigationMenuPortal } from './navigation-menu-portal.js';
import { NavigationMenuPositioner } from './navigation-menu-positioner.js';
import { NavigationMenuRoot } from './navigation-menu-root.js';
import { NavigationMenuTrigger } from './navigation-menu-trigger.js';
import { NavigationMenuViewport } from './navigation-menu-viewport.js';

export const NavigationMenu = {
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Content: NavigationMenuContent,
  Trigger: NavigationMenuTrigger,
  Portal: NavigationMenuPortal,
  Positioner: NavigationMenuPositioner,
  Viewport: NavigationMenuViewport,
  Backdrop: NavigationMenuBackdrop,
  Popup: NavigationMenuPopup,
  Arrow: NavigationMenuArrow,
  Link: NavigationMenuLink,
  Icon: NavigationMenuIcon,
} as const;

export type {
  NavigationMenuArrowState,
  NavigationMenuBackdropState,
  NavigationMenuContentState,
  NavigationMenuIconState,
  NavigationMenuItemState,
  NavigationMenuLinkState,
  NavigationMenuListState,
  NavigationMenuPopupState,
  NavigationMenuPortalState,
  NavigationMenuPositionerState,
  NavigationMenuRootState,
  NavigationMenuTriggerState,
  NavigationMenuViewportState,
} from '@base-ui/react/navigation-menu';
export type { NavigationMenuArrowProps } from './navigation-menu-arrow.js';
export type { NavigationMenuBackdropProps } from './navigation-menu-backdrop.js';
export type { NavigationMenuContentProps } from './navigation-menu-content.js';
export type { NavigationMenuIconProps } from './navigation-menu-icon.js';
export type { NavigationMenuItemProps } from './navigation-menu-item.js';
export type { NavigationMenuLinkProps } from './navigation-menu-link.js';
export type { NavigationMenuListProps } from './navigation-menu-list.js';
export type { NavigationMenuPopupProps } from './navigation-menu-popup.js';
export type { NavigationMenuPortalProps } from './navigation-menu-portal.js';
export type { NavigationMenuPositionerProps } from './navigation-menu-positioner.js';
export type { NavigationMenuRootProps } from './navigation-menu-root.js';
export type { NavigationMenuTriggerProps } from './navigation-menu-trigger.js';
export type { NavigationMenuViewportProps } from './navigation-menu-viewport.js';
export {
  NavigationMenuArrow,
  NavigationMenuBackdrop,
  NavigationMenuContent,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
