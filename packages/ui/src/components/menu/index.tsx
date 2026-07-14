import { MenuArrow } from './menu-arrow.js';
import { MenuBackdrop } from './menu-backdrop.js';
import { MenuCheckboxItem } from './menu-checkbox-item.js';
import { MenuCheckboxItemIndicator } from './menu-checkbox-item-indicator.js';
import { MenuGroup } from './menu-group.js';
import { MenuGroupLabel } from './menu-group-label.js';
import type { MenuHandle as MenuHandleType } from './menu-handle.js';
import { createMenuHandle } from './menu-handle.js';
import { MenuItem } from './menu-item.js';
import { MenuLinkItem } from './menu-link-item.js';
import { MenuPopup } from './menu-popup.js';
import { MenuPortal } from './menu-portal.js';
import { MenuPositioner } from './menu-positioner.js';
import { MenuRadioGroup } from './menu-radio-group.js';
import { MenuRadioItem } from './menu-radio-item.js';
import { MenuRadioItemIndicator } from './menu-radio-item-indicator.js';
import { MenuRoot } from './menu-root.js';
import { MenuSeparator } from './menu-separator.js';
import { MenuSubmenuRoot } from './menu-submenu-root.js';
import { MenuSubmenuTrigger } from './menu-submenu-trigger.js';
import { MenuTrigger } from './menu-trigger.js';
import { MenuViewport } from './menu-viewport.js';

export const Menu = {
  Arrow: MenuArrow,
  Backdrop: MenuBackdrop,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: MenuCheckboxItemIndicator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Item: MenuItem,
  LinkItem: MenuLinkItem,
  Popup: MenuPopup,
  Portal: MenuPortal,
  Positioner: MenuPositioner,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  RadioItemIndicator: MenuRadioItemIndicator,
  Root: MenuRoot,
  SubmenuRoot: MenuSubmenuRoot,
  Trigger: MenuTrigger,
  Viewport: MenuViewport,
  Separator: MenuSeparator,
  SubmenuTrigger: MenuSubmenuTrigger,
  createHandle: createMenuHandle as <Payload>() => MenuHandleType<Payload>,
} as const;

export type {
  MenuArrowState,
  MenuBackdropState,
  MenuCheckboxItemIndicatorState,
  MenuCheckboxItemState,
  MenuGroupLabelState,
  MenuGroupState,
  MenuItemState,
  MenuLinkItemState,
  MenuPopupState,
  MenuPortalState,
  MenuPositionerState,
  MenuRadioGroupState,
  MenuRadioItemIndicatorState,
  MenuRadioItemState,
  MenuRootState,
  MenuSubmenuRootState,
  MenuSubmenuTriggerState,
  MenuTriggerState,
  MenuViewportState,
} from '@base-ui/react/menu';
export type { MenuArrowProps } from './menu-arrow.js';
export type { MenuBackdropProps } from './menu-backdrop.js';
export type { MenuCheckboxItemProps } from './menu-checkbox-item.js';
export type { MenuCheckboxItemIndicatorProps } from './menu-checkbox-item-indicator.js';
export type { MenuGroupProps } from './menu-group.js';
export type { MenuGroupLabelProps } from './menu-group-label.js';
export type { MenuHandle } from './menu-handle.js';
export type { MenuItemProps } from './menu-item.js';
export type { MenuLinkItemProps } from './menu-link-item.js';
export type { MenuPopupProps } from './menu-popup.js';
export type { MenuPortalProps } from './menu-portal.js';
export type { MenuPositionerProps } from './menu-positioner.js';
export type { MenuRadioGroupProps } from './menu-radio-group.js';
export type { MenuRadioItemProps } from './menu-radio-item.js';
export type { MenuRadioItemIndicatorProps } from './menu-radio-item-indicator.js';
export type { MenuRootProps } from './menu-root.js';
export type { MenuSeparatorProps } from './menu-separator.js';
export type { MenuSubmenuRootProps } from './menu-submenu-root.js';
export type { MenuSubmenuTriggerProps } from './menu-submenu-trigger.js';
export type { MenuTriggerProps } from './menu-trigger.js';
export type { MenuViewportProps } from './menu-viewport.js';
export {
  createMenuHandle,
  MenuArrow,
  MenuBackdrop,
  MenuCheckboxItem,
  MenuCheckboxItemIndicator,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
  MenuRoot,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuTrigger,
  MenuViewport,
};
