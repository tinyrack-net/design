import { TRContextMenuArrow } from './context-menu-arrow.js';
import { TRContextMenuBackdrop } from './context-menu-backdrop.js';
import { TRContextMenuCheckboxItem } from './context-menu-checkbox-item.js';
import { TRContextMenuCheckboxItemIndicator } from './context-menu-checkbox-item-indicator.js';
import { TRContextMenuGroup } from './context-menu-group.js';
import { TRContextMenuGroupLabel } from './context-menu-group-label.js';
import { TRContextMenuItem } from './context-menu-item.js';
import { TRContextMenuLinkItem } from './context-menu-link-item.js';
import { TRContextMenuPopup } from './context-menu-popup.js';
import { TRContextMenuPortal } from './context-menu-portal.js';
import { TRContextMenuPositioner } from './context-menu-positioner.js';
import { TRContextMenuRadioGroup } from './context-menu-radio-group.js';
import { TRContextMenuRadioItem } from './context-menu-radio-item.js';
import { TRContextMenuRadioItemIndicator } from './context-menu-radio-item-indicator.js';
import { TRContextMenuRoot } from './context-menu-root.js';
import { TRContextMenuSeparator } from './context-menu-separator.js';
import { TRContextMenuSubmenuRoot } from './context-menu-submenu-root.js';
import { TRContextMenuSubmenuTrigger } from './context-menu-submenu-trigger.js';
import { TRContextMenuTrigger } from './context-menu-trigger.js';

export const TRContextMenu = {
  Root: TRContextMenuRoot,
  Trigger: TRContextMenuTrigger,
  Backdrop: TRContextMenuBackdrop,
  Portal: TRContextMenuPortal,
  Positioner: TRContextMenuPositioner,
  Popup: TRContextMenuPopup,
  Arrow: TRContextMenuArrow,
  Group: TRContextMenuGroup,
  GroupLabel: TRContextMenuGroupLabel,
  Item: TRContextMenuItem,
  CheckboxItem: TRContextMenuCheckboxItem,
  CheckboxItemIndicator: TRContextMenuCheckboxItemIndicator,
  LinkItem: TRContextMenuLinkItem,
  RadioGroup: TRContextMenuRadioGroup,
  RadioItem: TRContextMenuRadioItem,
  RadioItemIndicator: TRContextMenuRadioItemIndicator,
  SubmenuRoot: TRContextMenuSubmenuRoot,
  SubmenuTrigger: TRContextMenuSubmenuTrigger,
  Separator: TRContextMenuSeparator,
} as const;

export type {
  ContextMenuArrowState as TRContextMenuArrowState,
  ContextMenuBackdropState as TRContextMenuBackdropState,
  ContextMenuCheckboxItemIndicatorState as TRContextMenuCheckboxItemIndicatorState,
  ContextMenuCheckboxItemState as TRContextMenuCheckboxItemState,
  ContextMenuGroupLabelState as TRContextMenuGroupLabelState,
  ContextMenuGroupState as TRContextMenuGroupState,
  ContextMenuItemState as TRContextMenuItemState,
  ContextMenuLinkItemState as TRContextMenuLinkItemState,
  ContextMenuPopupState as TRContextMenuPopupState,
  ContextMenuPortalState as TRContextMenuPortalState,
  ContextMenuPositionerState as TRContextMenuPositionerState,
  ContextMenuRadioGroupState as TRContextMenuRadioGroupState,
  ContextMenuRadioItemIndicatorState as TRContextMenuRadioItemIndicatorState,
  ContextMenuRadioItemState as TRContextMenuRadioItemState,
  ContextMenuRootState as TRContextMenuRootState,
  ContextMenuSubmenuRootState as TRContextMenuSubmenuRootState,
  ContextMenuSubmenuTriggerState as TRContextMenuSubmenuTriggerState,
  ContextMenuTriggerState as TRContextMenuTriggerState,
} from '@base-ui/react/context-menu';
export type { TRContextMenuArrowProps } from './context-menu-arrow.js';
export type { TRContextMenuBackdropProps } from './context-menu-backdrop.js';
export type { TRContextMenuCheckboxItemProps } from './context-menu-checkbox-item.js';
export type { TRContextMenuCheckboxItemIndicatorProps } from './context-menu-checkbox-item-indicator.js';
export type { TRContextMenuGroupProps } from './context-menu-group.js';
export type { TRContextMenuGroupLabelProps } from './context-menu-group-label.js';
export type {
  TRContextMenuItemProps,
  TRContextMenuItemVariant,
} from './context-menu-item.js';
export type { TRContextMenuLinkItemProps } from './context-menu-link-item.js';
export type { TRContextMenuPopupProps } from './context-menu-popup.js';
export type { TRContextMenuPortalProps } from './context-menu-portal.js';
export type { TRContextMenuPositionerProps } from './context-menu-positioner.js';
export type { TRContextMenuRadioGroupProps } from './context-menu-radio-group.js';
export type { TRContextMenuRadioItemProps } from './context-menu-radio-item.js';
export type { TRContextMenuRadioItemIndicatorProps } from './context-menu-radio-item-indicator.js';
export type { TRContextMenuRootProps } from './context-menu-root.js';
export type { TRContextMenuSeparatorProps } from './context-menu-separator.js';
export type { TRContextMenuSubmenuRootProps } from './context-menu-submenu-root.js';
export type { TRContextMenuSubmenuTriggerProps } from './context-menu-submenu-trigger.js';
export type { TRContextMenuTriggerProps } from './context-menu-trigger.js';
export {
  TRContextMenuArrow,
  TRContextMenuBackdrop,
  TRContextMenuCheckboxItem,
  TRContextMenuCheckboxItemIndicator,
  TRContextMenuGroup,
  TRContextMenuGroupLabel,
  TRContextMenuItem,
  TRContextMenuLinkItem,
  TRContextMenuPopup,
  TRContextMenuPortal,
  TRContextMenuPositioner,
  TRContextMenuRadioGroup,
  TRContextMenuRadioItem,
  TRContextMenuRadioItemIndicator,
  TRContextMenuRoot,
  TRContextMenuSeparator,
  TRContextMenuSubmenuRoot,
  TRContextMenuSubmenuTrigger,
  TRContextMenuTrigger,
};
