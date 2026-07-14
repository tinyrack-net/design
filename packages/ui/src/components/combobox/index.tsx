import { ComboboxArrow } from './combobox-arrow.js';
import { ComboboxBackdrop } from './combobox-backdrop.js';
import { ComboboxChip } from './combobox-chip.js';
import { ComboboxChipRemove } from './combobox-chip-remove.js';
import { ComboboxChips } from './combobox-chips.js';
import { ComboboxClear } from './combobox-clear.js';
import { ComboboxCollection } from './combobox-collection.js';
import { ComboboxEmpty } from './combobox-empty.js';
import { useComboboxFilter, useComboboxFilteredItems } from './combobox-filter.js';
import { ComboboxGroup } from './combobox-group.js';
import { ComboboxGroupLabel } from './combobox-group-label.js';
import { ComboboxIcon } from './combobox-icon.js';
import { ComboboxInput } from './combobox-input.js';
import { ComboboxInputGroup } from './combobox-input-group.js';
import { ComboboxItem } from './combobox-item.js';
import { ComboboxItemIndicator } from './combobox-item-indicator.js';
import { ComboboxLabel } from './combobox-label.js';
import { ComboboxList } from './combobox-list.js';
import { ComboboxPopup } from './combobox-popup.js';
import { ComboboxPortal } from './combobox-portal.js';
import { ComboboxPositioner } from './combobox-positioner.js';
import { ComboboxRoot } from './combobox-root.js';
import { ComboboxRow } from './combobox-row.js';
import { ComboboxSeparator } from './combobox-separator.js';
import { ComboboxStatus } from './combobox-status.js';
import { ComboboxTrigger } from './combobox-trigger.js';
import { ComboboxValue } from './combobox-value.js';

export const Combobox = {
  Root: ComboboxRoot,
  Label: ComboboxLabel,
  Value: ComboboxValue,
  Input: ComboboxInput,
  InputGroup: ComboboxInputGroup,
  Trigger: ComboboxTrigger,
  List: ComboboxList,
  Status: ComboboxStatus,
  Portal: ComboboxPortal,
  Backdrop: ComboboxBackdrop,
  Positioner: ComboboxPositioner,
  Popup: ComboboxPopup,
  Arrow: ComboboxArrow,
  Icon: ComboboxIcon,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Item: ComboboxItem,
  ItemIndicator: ComboboxItemIndicator,
  Chips: ComboboxChips,
  Chip: ComboboxChip,
  ChipRemove: ComboboxChipRemove,
  Row: ComboboxRow,
  Collection: ComboboxCollection,
  Empty: ComboboxEmpty,
  Clear: ComboboxClear,
  Separator: ComboboxSeparator,
  useFilter: useComboboxFilter,
  useFilteredItems: useComboboxFilteredItems,
} as const;

export type {
  ComboboxArrowState,
  ComboboxBackdropState,
  ComboboxChipRemoveState,
  ComboboxChipState,
  ComboboxChipsState,
  ComboboxClearState,
  ComboboxCollectionState,
  ComboboxEmptyState,
  ComboboxGroupLabelState,
  ComboboxGroupState,
  ComboboxIconState,
  ComboboxInputGroupState,
  ComboboxInputState,
  ComboboxItemIndicatorState,
  ComboboxItemState,
  ComboboxLabelState,
  ComboboxListState,
  ComboboxPopupState,
  ComboboxPortalState,
  ComboboxPositionerState,
  ComboboxRootState,
  ComboboxRowState,
  ComboboxStatusState,
  ComboboxTriggerState,
  ComboboxValueState,
} from '@base-ui/react/combobox';
export type { ComboboxArrowProps } from './combobox-arrow.js';
export type { ComboboxBackdropProps } from './combobox-backdrop.js';
export type { ComboboxChipProps } from './combobox-chip.js';
export type { ComboboxChipRemoveProps } from './combobox-chip-remove.js';
export type { ComboboxChipsProps } from './combobox-chips.js';
export type { ComboboxClearProps } from './combobox-clear.js';
export type { ComboboxCollectionProps } from './combobox-collection.js';
export type { ComboboxEmptyProps } from './combobox-empty.js';
export type { ComboboxGroupProps } from './combobox-group.js';
export type { ComboboxGroupLabelProps } from './combobox-group-label.js';
export type { ComboboxIconProps } from './combobox-icon.js';
export type { ComboboxInputProps } from './combobox-input.js';
export type { ComboboxInputGroupProps } from './combobox-input-group.js';
export type { ComboboxItemProps } from './combobox-item.js';
export type { ComboboxItemIndicatorProps } from './combobox-item-indicator.js';
export type { ComboboxLabelProps } from './combobox-label.js';
export type { ComboboxListProps } from './combobox-list.js';
export type { ComboboxPopupProps } from './combobox-popup.js';
export type { ComboboxPortalProps } from './combobox-portal.js';
export type { ComboboxPositionerProps } from './combobox-positioner.js';
export type { ComboboxRootProps } from './combobox-root.js';
export type { ComboboxRowProps } from './combobox-row.js';
export type { ComboboxSeparatorProps } from './combobox-separator.js';
export type { ComboboxStatusProps } from './combobox-status.js';
export type { ComboboxTriggerProps } from './combobox-trigger.js';
export type { ComboboxValueProps } from './combobox-value.js';
export {
  ComboboxArrow,
  ComboboxBackdrop,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxIcon,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxRoot,
  ComboboxRow,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxFilter,
  useComboboxFilteredItems,
};
