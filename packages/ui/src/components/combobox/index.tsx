import { TRComboboxArrow } from './combobox-arrow.js';
import { TRComboboxBackdrop } from './combobox-backdrop.js';
import { TRComboboxChip } from './combobox-chip.js';
import { TRComboboxChipRemove } from './combobox-chip-remove.js';
import { TRComboboxChips } from './combobox-chips.js';
import { TRComboboxClear } from './combobox-clear.js';
import { TRComboboxCollection } from './combobox-collection.js';
import { TRComboboxEmpty } from './combobox-empty.js';
import { useComboboxFilter, useComboboxFilteredItems } from './combobox-filter.js';
import { TRComboboxGroup } from './combobox-group.js';
import { TRComboboxGroupLabel } from './combobox-group-label.js';
import { TRComboboxIcon } from './combobox-icon.js';
import { TRComboboxInput } from './combobox-input.js';
import { TRComboboxInputAdornment } from './combobox-input-adornment.js';
import { TRComboboxInputGroup } from './combobox-input-group.js';
import { TRComboboxItem } from './combobox-item.js';
import { TRComboboxItemIndicator } from './combobox-item-indicator.js';
import { TRComboboxLabel } from './combobox-label.js';
import { TRComboboxList } from './combobox-list.js';
import { TRComboboxPopup } from './combobox-popup.js';
import { TRComboboxPortal } from './combobox-portal.js';
import { TRComboboxPositioner } from './combobox-positioner.js';
import { TRComboboxRoot } from './combobox-root.js';
import { TRComboboxRow } from './combobox-row.js';
import { TRComboboxSeparator } from './combobox-separator.js';
import { TRComboboxStatus } from './combobox-status.js';
import { TRComboboxTrigger } from './combobox-trigger.js';
import { TRComboboxValue } from './combobox-value.js';

export const TRCombobox = {
  Root: TRComboboxRoot,
  Label: TRComboboxLabel,
  Value: TRComboboxValue,
  Input: TRComboboxInput,
  InputAdornment: TRComboboxInputAdornment,
  InputGroup: TRComboboxInputGroup,
  Trigger: TRComboboxTrigger,
  List: TRComboboxList,
  Status: TRComboboxStatus,
  Portal: TRComboboxPortal,
  Backdrop: TRComboboxBackdrop,
  Positioner: TRComboboxPositioner,
  Popup: TRComboboxPopup,
  Arrow: TRComboboxArrow,
  Icon: TRComboboxIcon,
  Group: TRComboboxGroup,
  GroupLabel: TRComboboxGroupLabel,
  Item: TRComboboxItem,
  ItemIndicator: TRComboboxItemIndicator,
  Chips: TRComboboxChips,
  Chip: TRComboboxChip,
  ChipRemove: TRComboboxChipRemove,
  Row: TRComboboxRow,
  Collection: TRComboboxCollection,
  Empty: TRComboboxEmpty,
  Clear: TRComboboxClear,
  Separator: TRComboboxSeparator,
  useFilter: useComboboxFilter,
  useFilteredItems: useComboboxFilteredItems,
} as const;

export type {
  ComboboxArrowState as TRComboboxArrowState,
  ComboboxBackdropState as TRComboboxBackdropState,
  ComboboxChipRemoveState as TRComboboxChipRemoveState,
  ComboboxChipState as TRComboboxChipState,
  ComboboxChipsState as TRComboboxChipsState,
  ComboboxClearState as TRComboboxClearState,
  ComboboxCollectionState as TRComboboxCollectionState,
  ComboboxEmptyState as TRComboboxEmptyState,
  ComboboxFilter as TRComboboxFilter,
  ComboboxFilterOptions as TRComboboxFilterOptions,
  ComboboxGroupLabelState as TRComboboxGroupLabelState,
  ComboboxGroupState as TRComboboxGroupState,
  ComboboxIconState as TRComboboxIconState,
  ComboboxInputGroupState as TRComboboxInputGroupState,
  ComboboxInputState as TRComboboxInputState,
  ComboboxItemIndicatorState as TRComboboxItemIndicatorState,
  ComboboxItemState as TRComboboxItemState,
  ComboboxLabelState as TRComboboxLabelState,
  ComboboxListState as TRComboboxListState,
  ComboboxPopupState as TRComboboxPopupState,
  ComboboxPortalState as TRComboboxPortalState,
  ComboboxPositionerState as TRComboboxPositionerState,
  ComboboxRootActions as TRComboboxRootActions,
  ComboboxRootChangeEventDetails as TRComboboxRootChangeEventDetails,
  ComboboxRootChangeEventReason as TRComboboxRootChangeEventReason,
  ComboboxRootHighlightEventDetails as TRComboboxRootHighlightEventDetails,
  ComboboxRootHighlightEventReason as TRComboboxRootHighlightEventReason,
  ComboboxRootState as TRComboboxRootState,
  ComboboxRowState as TRComboboxRowState,
  ComboboxStatusState as TRComboboxStatusState,
  ComboboxTriggerState as TRComboboxTriggerState,
  ComboboxValueState as TRComboboxValueState,
} from '@base-ui/react/combobox';
export type { TRComboboxArrowProps } from './combobox-arrow.js';
export type { TRComboboxBackdropProps } from './combobox-backdrop.js';
export type { TRComboboxChipProps } from './combobox-chip.js';
export type { TRComboboxChipRemoveProps } from './combobox-chip-remove.js';
export type { TRComboboxChipsProps } from './combobox-chips.js';
export type { TRComboboxClearProps } from './combobox-clear.js';
export type { TRComboboxCollectionProps } from './combobox-collection.js';
export type { TRComboboxEmptyProps } from './combobox-empty.js';
export type { TRComboboxGroupProps } from './combobox-group.js';
export type { TRComboboxGroupLabelProps } from './combobox-group-label.js';
export type { TRComboboxIconProps } from './combobox-icon.js';
export type { TRComboboxInputProps } from './combobox-input.js';
export type { TRComboboxInputAdornmentProps } from './combobox-input-adornment.js';
export type { TRComboboxInputGroupProps } from './combobox-input-group.js';
export type { TRComboboxItemProps } from './combobox-item.js';
export type { TRComboboxItemIndicatorProps } from './combobox-item-indicator.js';
export type { TRComboboxLabelProps } from './combobox-label.js';
export type { TRComboboxListProps } from './combobox-list.js';
export type { TRComboboxPopupProps } from './combobox-popup.js';
export type { TRComboboxPortalProps } from './combobox-portal.js';
export type { TRComboboxPositionerProps } from './combobox-positioner.js';
export type { TRComboboxRootProps } from './combobox-root.js';
export type { TRComboboxRowProps } from './combobox-row.js';
export type {
  TRComboboxSeparatorProps,
  TRComboboxSeparatorState,
} from './combobox-separator.js';
export type { TRComboboxStatusProps } from './combobox-status.js';
export type { TRComboboxTriggerProps } from './combobox-trigger.js';
export type { TRComboboxValueProps } from './combobox-value.js';
export {
  TRComboboxArrow,
  TRComboboxBackdrop,
  TRComboboxChip,
  TRComboboxChipRemove,
  TRComboboxChips,
  TRComboboxClear,
  TRComboboxCollection,
  TRComboboxEmpty,
  TRComboboxGroup,
  TRComboboxGroupLabel,
  TRComboboxIcon,
  TRComboboxInput,
  TRComboboxInputAdornment,
  TRComboboxInputGroup,
  TRComboboxItem,
  TRComboboxItemIndicator,
  TRComboboxLabel,
  TRComboboxList,
  TRComboboxPopup,
  TRComboboxPortal,
  TRComboboxPositioner,
  TRComboboxRoot,
  TRComboboxRow,
  TRComboboxSeparator,
  TRComboboxStatus,
  TRComboboxTrigger,
  TRComboboxValue,
  useComboboxFilter,
  useComboboxFilteredItems,
};
