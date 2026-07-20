import { TRSelectArrow } from './select-arrow.js';
import { TRSelectBackdrop } from './select-backdrop.js';
import { TRSelectGroup } from './select-group.js';
import { TRSelectGroupLabel } from './select-group-label.js';
import { TRSelectIcon } from './select-icon.js';
import { TRSelectItem } from './select-item.js';
import { TRSelectItemIndicator } from './select-item-indicator.js';
import { TRSelectItemText } from './select-item-text.js';
import { TRSelectLabel } from './select-label.js';
import { TRSelectList } from './select-list.js';
import { TRSelectPopup } from './select-popup.js';
import { TRSelectPortal } from './select-portal.js';
import { TRSelectPositioner } from './select-positioner.js';
import { TRSelectRoot } from './select-root.js';
import { TRSelectScrollDownArrow } from './select-scroll-down-arrow.js';
import { TRSelectScrollUpArrow } from './select-scroll-up-arrow.js';
import { TRSelectSeparator } from './select-separator.js';
import { TRSelectTrigger } from './select-trigger.js';
import { TRSelectValue } from './select-value.js';

export const TRSelect = {
  Root: TRSelectRoot,
  Label: TRSelectLabel,
  Trigger: TRSelectTrigger,
  Value: TRSelectValue,
  Icon: TRSelectIcon,
  Portal: TRSelectPortal,
  Backdrop: TRSelectBackdrop,
  Positioner: TRSelectPositioner,
  Popup: TRSelectPopup,
  List: TRSelectList,
  Item: TRSelectItem,
  ItemIndicator: TRSelectItemIndicator,
  ItemText: TRSelectItemText,
  Arrow: TRSelectArrow,
  ScrollDownArrow: TRSelectScrollDownArrow,
  ScrollUpArrow: TRSelectScrollUpArrow,
  Group: TRSelectGroup,
  GroupLabel: TRSelectGroupLabel,
  Separator: TRSelectSeparator,
} as const;

export type {
  SelectArrowState as TRSelectArrowState,
  SelectBackdropState as TRSelectBackdropState,
  SelectGroupLabelState as TRSelectGroupLabelState,
  SelectGroupState as TRSelectGroupState,
  SelectIconState as TRSelectIconState,
  SelectItemIndicatorState as TRSelectItemIndicatorState,
  SelectItemState as TRSelectItemState,
  SelectItemTextState as TRSelectItemTextState,
  SelectLabelState as TRSelectLabelState,
  SelectListState as TRSelectListState,
  SelectPopupState as TRSelectPopupState,
  SelectPortalState as TRSelectPortalState,
  SelectPositionerState as TRSelectPositionerState,
  SelectRootState as TRSelectRootState,
  SelectScrollDownArrowState as TRSelectScrollDownArrowState,
  SelectScrollUpArrowState as TRSelectScrollUpArrowState,
  SelectTriggerState as TRSelectTriggerState,
  SelectValueState as TRSelectValueState,
} from '@base-ui/react/select';
export type { TRSelectArrowProps } from './select-arrow.js';
export type { TRSelectBackdropProps } from './select-backdrop.js';
export type { TRSelectGroupProps } from './select-group.js';
export type { TRSelectGroupLabelProps } from './select-group-label.js';
export type { TRSelectIconProps } from './select-icon.js';
export type { TRSelectItemProps } from './select-item.js';
export type { TRSelectItemIndicatorProps } from './select-item-indicator.js';
export type { TRSelectItemTextProps } from './select-item-text.js';
export type { TRSelectLabelProps } from './select-label.js';
export type { TRSelectListProps } from './select-list.js';
export type { TRSelectPopupProps } from './select-popup.js';
export type { TRSelectPortalProps } from './select-portal.js';
export type { TRSelectPositionerProps } from './select-positioner.js';
export type { TRSelectRootProps } from './select-root.js';
export type { TRSelectScrollDownArrowProps } from './select-scroll-down-arrow.js';
export type { TRSelectScrollUpArrowProps } from './select-scroll-up-arrow.js';
export type { TRSelectSeparatorProps } from './select-separator.js';
export type { TRSelectTriggerProps, TRSelectTriggerUiSize } from './select-trigger.js';
export type { TRSelectValueProps } from './select-value.js';
export {
  TRSelectArrow,
  TRSelectBackdrop,
  TRSelectGroup,
  TRSelectGroupLabel,
  TRSelectIcon,
  TRSelectItem,
  TRSelectItemIndicator,
  TRSelectItemText,
  TRSelectLabel,
  TRSelectList,
  TRSelectPopup,
  TRSelectPortal,
  TRSelectPositioner,
  TRSelectRoot,
  TRSelectScrollDownArrow,
  TRSelectScrollUpArrow,
  TRSelectSeparator,
  TRSelectTrigger,
  TRSelectValue,
};
