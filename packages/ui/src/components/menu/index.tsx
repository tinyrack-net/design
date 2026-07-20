import { TRMenuArrow } from './menu-arrow.js';
import { TRMenuBackdrop } from './menu-backdrop.js';
import { TRMenuCheckboxItem } from './menu-checkbox-item.js';
import { TRMenuCheckboxItemIndicator } from './menu-checkbox-item-indicator.js';
import { TRMenuGroup } from './menu-group.js';
import { TRMenuGroupLabel } from './menu-group-label.js';
import type { TRMenuHandle as MenuHandleType } from './menu-handle.js';
import { createMenuHandle } from './menu-handle.js';
import { TRMenuItem } from './menu-item.js';
import { TRMenuLinkItem } from './menu-link-item.js';
import { TRMenuPopup } from './menu-popup.js';
import { TRMenuPortal } from './menu-portal.js';
import { TRMenuPositioner } from './menu-positioner.js';
import { TRMenuRadioGroup } from './menu-radio-group.js';
import { TRMenuRadioItem } from './menu-radio-item.js';
import { TRMenuRadioItemIndicator } from './menu-radio-item-indicator.js';
import { TRMenuRoot } from './menu-root.js';
import { TRMenuSeparator } from './menu-separator.js';
import { TRMenuSubmenuRoot } from './menu-submenu-root.js';
import { TRMenuSubmenuTrigger } from './menu-submenu-trigger.js';
import { TRMenuTrigger } from './menu-trigger.js';
import { TRMenuViewport } from './menu-viewport.js';

export const TRMenu = {
  Arrow: TRMenuArrow,
  Backdrop: TRMenuBackdrop,
  CheckboxItem: TRMenuCheckboxItem,
  CheckboxItemIndicator: TRMenuCheckboxItemIndicator,
  Group: TRMenuGroup,
  GroupLabel: TRMenuGroupLabel,
  Item: TRMenuItem,
  LinkItem: TRMenuLinkItem,
  Popup: TRMenuPopup,
  Portal: TRMenuPortal,
  Positioner: TRMenuPositioner,
  RadioGroup: TRMenuRadioGroup,
  RadioItem: TRMenuRadioItem,
  RadioItemIndicator: TRMenuRadioItemIndicator,
  Root: TRMenuRoot,
  SubmenuRoot: TRMenuSubmenuRoot,
  Trigger: TRMenuTrigger,
  Viewport: TRMenuViewport,
  Separator: TRMenuSeparator,
  SubmenuTrigger: TRMenuSubmenuTrigger,
  createHandle: createMenuHandle as <Payload>() => MenuHandleType<Payload>,
} as const;

export type {
  MenuArrowState as TRMenuArrowState,
  MenuBackdropState as TRMenuBackdropState,
  MenuCheckboxItemIndicatorState as TRMenuCheckboxItemIndicatorState,
  MenuCheckboxItemState as TRMenuCheckboxItemState,
  MenuGroupLabelState as TRMenuGroupLabelState,
  MenuGroupState as TRMenuGroupState,
  MenuItemState as TRMenuItemState,
  MenuLinkItemState as TRMenuLinkItemState,
  MenuPopupState as TRMenuPopupState,
  MenuPortalState as TRMenuPortalState,
  MenuPositionerState as TRMenuPositionerState,
  MenuRadioGroupState as TRMenuRadioGroupState,
  MenuRadioItemIndicatorState as TRMenuRadioItemIndicatorState,
  MenuRadioItemState as TRMenuRadioItemState,
  MenuRootState as TRMenuRootState,
  MenuSubmenuRootState as TRMenuSubmenuRootState,
  MenuSubmenuTriggerState as TRMenuSubmenuTriggerState,
  MenuTriggerState as TRMenuTriggerState,
  MenuViewportState as TRMenuViewportState,
} from '@base-ui/react/menu';
export type { TRMenuArrowProps } from './menu-arrow.js';
export type { TRMenuBackdropProps } from './menu-backdrop.js';
export type { TRMenuCheckboxItemProps } from './menu-checkbox-item.js';
export type { TRMenuCheckboxItemIndicatorProps } from './menu-checkbox-item-indicator.js';
export type { TRMenuGroupProps } from './menu-group.js';
export type { TRMenuGroupLabelProps } from './menu-group-label.js';
export type { TRMenuHandle } from './menu-handle.js';
export type { TRMenuItemProps } from './menu-item.js';
export type { TRMenuLinkItemProps } from './menu-link-item.js';
export type { TRMenuPopupProps } from './menu-popup.js';
export type { TRMenuPortalProps } from './menu-portal.js';
export type { TRMenuPositionerProps } from './menu-positioner.js';
export type { TRMenuRadioGroupProps } from './menu-radio-group.js';
export type { TRMenuRadioItemProps } from './menu-radio-item.js';
export type { TRMenuRadioItemIndicatorProps } from './menu-radio-item-indicator.js';
export type { TRMenuRootProps } from './menu-root.js';
export type { TRMenuSeparatorProps } from './menu-separator.js';
export type { TRMenuSubmenuRootProps } from './menu-submenu-root.js';
export type { TRMenuSubmenuTriggerProps } from './menu-submenu-trigger.js';
export type { TRMenuTriggerProps } from './menu-trigger.js';
export type { TRMenuViewportProps } from './menu-viewport.js';
export {
  createMenuHandle,
  TRMenuArrow,
  TRMenuBackdrop,
  TRMenuCheckboxItem,
  TRMenuCheckboxItemIndicator,
  TRMenuGroup,
  TRMenuGroupLabel,
  TRMenuItem,
  TRMenuLinkItem,
  TRMenuPopup,
  TRMenuPortal,
  TRMenuPositioner,
  TRMenuRadioGroup,
  TRMenuRadioItem,
  TRMenuRadioItemIndicator,
  TRMenuRoot,
  TRMenuSeparator,
  TRMenuSubmenuRoot,
  TRMenuSubmenuTrigger,
  TRMenuTrigger,
  TRMenuViewport,
};
