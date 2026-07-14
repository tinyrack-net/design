import { ContextMenuArrow } from './context-menu-arrow.js';
import { ContextMenuBackdrop } from './context-menu-backdrop.js';
import { ContextMenuCheckboxItem } from './context-menu-checkbox-item.js';
import { ContextMenuCheckboxItemIndicator } from './context-menu-checkbox-item-indicator.js';
import { ContextMenuGroup } from './context-menu-group.js';
import { ContextMenuGroupLabel } from './context-menu-group-label.js';
import { ContextMenuItem } from './context-menu-item.js';
import { ContextMenuLinkItem } from './context-menu-link-item.js';
import { ContextMenuPopup } from './context-menu-popup.js';
import { ContextMenuPortal } from './context-menu-portal.js';
import { ContextMenuPositioner } from './context-menu-positioner.js';
import { ContextMenuRadioGroup } from './context-menu-radio-group.js';
import { ContextMenuRadioItem } from './context-menu-radio-item.js';
import { ContextMenuRadioItemIndicator } from './context-menu-radio-item-indicator.js';
import { ContextMenuRoot } from './context-menu-root.js';
import { ContextMenuSeparator } from './context-menu-separator.js';
import { ContextMenuSubmenuRoot } from './context-menu-submenu-root.js';
import { ContextMenuSubmenuTrigger } from './context-menu-submenu-trigger.js';
import { ContextMenuTrigger } from './context-menu-trigger.js';

export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Backdrop: ContextMenuBackdrop,
  Portal: ContextMenuPortal,
  Positioner: ContextMenuPositioner,
  Popup: ContextMenuPopup,
  Arrow: ContextMenuArrow,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  CheckboxItemIndicator: ContextMenuCheckboxItemIndicator,
  LinkItem: ContextMenuLinkItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  RadioItemIndicator: ContextMenuRadioItemIndicator,
  SubmenuRoot: ContextMenuSubmenuRoot,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
  Separator: ContextMenuSeparator,
} as const;

export type {
  ContextMenuArrowState,
  ContextMenuBackdropState,
  ContextMenuCheckboxItemIndicatorState,
  ContextMenuCheckboxItemState,
  ContextMenuGroupLabelState,
  ContextMenuGroupState,
  ContextMenuItemState,
  ContextMenuLinkItemState,
  ContextMenuPopupState,
  ContextMenuPortalState,
  ContextMenuPositionerState,
  ContextMenuRadioGroupState,
  ContextMenuRadioItemIndicatorState,
  ContextMenuRadioItemState,
  ContextMenuRootState,
  ContextMenuSubmenuRootState,
  ContextMenuSubmenuTriggerState,
  ContextMenuTriggerState,
} from '@base-ui/react/context-menu';
export type { ContextMenuArrowProps } from './context-menu-arrow.js';
export type { ContextMenuBackdropProps } from './context-menu-backdrop.js';
export type { ContextMenuCheckboxItemProps } from './context-menu-checkbox-item.js';
export type { ContextMenuCheckboxItemIndicatorProps } from './context-menu-checkbox-item-indicator.js';
export type { ContextMenuGroupProps } from './context-menu-group.js';
export type { ContextMenuGroupLabelProps } from './context-menu-group-label.js';
export type { ContextMenuItemProps } from './context-menu-item.js';
export type { ContextMenuLinkItemProps } from './context-menu-link-item.js';
export type { ContextMenuPopupProps } from './context-menu-popup.js';
export type { ContextMenuPortalProps } from './context-menu-portal.js';
export type { ContextMenuPositionerProps } from './context-menu-positioner.js';
export type { ContextMenuRadioGroupProps } from './context-menu-radio-group.js';
export type { ContextMenuRadioItemProps } from './context-menu-radio-item.js';
export type { ContextMenuRadioItemIndicatorProps } from './context-menu-radio-item-indicator.js';
export type { ContextMenuRootProps } from './context-menu-root.js';
export type { ContextMenuSeparatorProps } from './context-menu-separator.js';
export type { ContextMenuSubmenuRootProps } from './context-menu-submenu-root.js';
export type { ContextMenuSubmenuTriggerProps } from './context-menu-submenu-trigger.js';
export type { ContextMenuTriggerProps } from './context-menu-trigger.js';
export {
  ContextMenuArrow,
  ContextMenuBackdrop,
  ContextMenuCheckboxItem,
  ContextMenuCheckboxItemIndicator,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuLinkItem,
  ContextMenuPopup,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuRadioItemIndicator,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuSubmenuRoot,
  ContextMenuSubmenuTrigger,
  ContextMenuTrigger,
};
