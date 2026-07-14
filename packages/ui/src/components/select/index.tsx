import { SelectArrow } from './select-arrow.js';
import { SelectBackdrop } from './select-backdrop.js';
import { SelectGroup } from './select-group.js';
import { SelectGroupLabel } from './select-group-label.js';
import { SelectIcon } from './select-icon.js';
import { SelectItem } from './select-item.js';
import { SelectItemIndicator } from './select-item-indicator.js';
import { SelectItemText } from './select-item-text.js';
import { SelectLabel } from './select-label.js';
import { SelectList } from './select-list.js';
import { SelectPopup } from './select-popup.js';
import { SelectPortal } from './select-portal.js';
import { SelectPositioner } from './select-positioner.js';
import { SelectRoot } from './select-root.js';
import { SelectScrollDownArrow } from './select-scroll-down-arrow.js';
import { SelectScrollUpArrow } from './select-scroll-up-arrow.js';
import { SelectSeparator } from './select-separator.js';
import { SelectTrigger } from './select-trigger.js';
import { SelectValue } from './select-value.js';

export const Select = {
  Root: SelectRoot,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Portal: SelectPortal,
  Backdrop: SelectBackdrop,
  Positioner: SelectPositioner,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
  ItemText: SelectItemText,
  Arrow: SelectArrow,
  ScrollDownArrow: SelectScrollDownArrow,
  ScrollUpArrow: SelectScrollUpArrow,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
} as const;

export type {
  SelectArrowState,
  SelectBackdropState,
  SelectGroupLabelState,
  SelectGroupState,
  SelectIconState,
  SelectItemIndicatorState,
  SelectItemState,
  SelectItemTextState,
  SelectLabelState,
  SelectListState,
  SelectPopupState,
  SelectPortalState,
  SelectPositionerState,
  SelectRootState,
  SelectScrollDownArrowState,
  SelectScrollUpArrowState,
  SelectTriggerState,
  SelectValueState,
} from '@base-ui/react/select';
export type { SelectArrowProps } from './select-arrow.js';
export type { SelectBackdropProps } from './select-backdrop.js';
export type { SelectGroupProps } from './select-group.js';
export type { SelectGroupLabelProps } from './select-group-label.js';
export type { SelectIconProps } from './select-icon.js';
export type { SelectItemProps } from './select-item.js';
export type { SelectItemIndicatorProps } from './select-item-indicator.js';
export type { SelectItemTextProps } from './select-item-text.js';
export type { SelectLabelProps } from './select-label.js';
export type { SelectListProps } from './select-list.js';
export type { SelectPopupProps } from './select-popup.js';
export type { SelectPortalProps } from './select-portal.js';
export type { SelectPositionerProps } from './select-positioner.js';
export type { SelectRootProps } from './select-root.js';
export type { SelectScrollDownArrowProps } from './select-scroll-down-arrow.js';
export type { SelectScrollUpArrowProps } from './select-scroll-up-arrow.js';
export type { SelectSeparatorProps } from './select-separator.js';
export type { SelectTriggerProps } from './select-trigger.js';
export type { SelectValueProps } from './select-value.js';
export {
  SelectArrow,
  SelectBackdrop,
  SelectGroup,
  SelectGroupLabel,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectRoot,
  SelectScrollDownArrow,
  SelectScrollUpArrow,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
