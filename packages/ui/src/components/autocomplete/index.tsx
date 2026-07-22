import { TRAutocompleteArrow } from './autocomplete-arrow.js';
import { TRAutocompleteBackdrop } from './autocomplete-backdrop.js';
import { TRAutocompleteClear } from './autocomplete-clear.js';
import { TRAutocompleteCollection } from './autocomplete-collection.js';
import { TRAutocompleteEmpty } from './autocomplete-empty.js';
import {
  useAutocompleteFilter,
  useAutocompleteFilteredItems,
} from './autocomplete-filter.js';
import { TRAutocompleteGroup } from './autocomplete-group.js';
import { TRAutocompleteGroupLabel } from './autocomplete-group-label.js';
import { TRAutocompleteIcon } from './autocomplete-icon.js';
import { TRAutocompleteInput } from './autocomplete-input.js';
import { TRAutocompleteInputAdornment } from './autocomplete-input-adornment.js';
import { TRAutocompleteInputGroup } from './autocomplete-input-group.js';
import { TRAutocompleteItem } from './autocomplete-item.js';
import { TRAutocompleteList } from './autocomplete-list.js';
import { TRAutocompletePopup } from './autocomplete-popup.js';
import { TRAutocompletePortal } from './autocomplete-portal.js';
import { TRAutocompletePositioner } from './autocomplete-positioner.js';
import { TRAutocompleteRoot } from './autocomplete-root.js';
import { TRAutocompleteRow } from './autocomplete-row.js';
import { TRAutocompleteSeparator } from './autocomplete-separator.js';
import { TRAutocompleteStatus } from './autocomplete-status.js';
import { TRAutocompleteTrigger } from './autocomplete-trigger.js';
import { TRAutocompleteValue } from './autocomplete-value.js';

export const TRAutocomplete = {
  Root: TRAutocompleteRoot,
  Value: TRAutocompleteValue,
  Trigger: TRAutocompleteTrigger,
  Input: TRAutocompleteInput,
  InputAdornment: TRAutocompleteInputAdornment,
  InputGroup: TRAutocompleteInputGroup,
  Icon: TRAutocompleteIcon,
  Clear: TRAutocompleteClear,
  List: TRAutocompleteList,
  Status: TRAutocompleteStatus,
  Portal: TRAutocompletePortal,
  Backdrop: TRAutocompleteBackdrop,
  Positioner: TRAutocompletePositioner,
  Popup: TRAutocompletePopup,
  Arrow: TRAutocompleteArrow,
  Group: TRAutocompleteGroup,
  GroupLabel: TRAutocompleteGroupLabel,
  Item: TRAutocompleteItem,
  Row: TRAutocompleteRow,
  Collection: TRAutocompleteCollection,
  Empty: TRAutocompleteEmpty,
  Separator: TRAutocompleteSeparator,
  useFilter: useAutocompleteFilter,
  useFilteredItems: useAutocompleteFilteredItems,
} as const;

export type {
  AutocompleteArrowState as TRAutocompleteArrowState,
  AutocompleteBackdropState as TRAutocompleteBackdropState,
  AutocompleteClearState as TRAutocompleteClearState,
  AutocompleteCollectionState as TRAutocompleteCollectionState,
  AutocompleteEmptyState as TRAutocompleteEmptyState,
  AutocompleteFilter as TRAutocompleteFilter,
  AutocompleteFilterOptions as TRAutocompleteFilterOptions,
  AutocompleteGroupLabelState as TRAutocompleteGroupLabelState,
  AutocompleteGroupState as TRAutocompleteGroupState,
  AutocompleteIconState as TRAutocompleteIconState,
  AutocompleteInputGroupState as TRAutocompleteInputGroupState,
  AutocompleteInputState as TRAutocompleteInputState,
  AutocompleteItemState as TRAutocompleteItemState,
  AutocompleteListState as TRAutocompleteListState,
  AutocompletePopupState as TRAutocompletePopupState,
  AutocompletePortalState as TRAutocompletePortalState,
  AutocompletePositionerState as TRAutocompletePositionerState,
  AutocompleteRootActions as TRAutocompleteRootActions,
  AutocompleteRootChangeEventDetails as TRAutocompleteRootChangeEventDetails,
  AutocompleteRootChangeEventReason as TRAutocompleteRootChangeEventReason,
  AutocompleteRootHighlightEventDetails as TRAutocompleteRootHighlightEventDetails,
  AutocompleteRootHighlightEventReason as TRAutocompleteRootHighlightEventReason,
  AutocompleteRootState as TRAutocompleteRootState,
  AutocompleteRowState as TRAutocompleteRowState,
  AutocompleteStatusState as TRAutocompleteStatusState,
  AutocompleteTriggerState as TRAutocompleteTriggerState,
  AutocompleteValueState as TRAutocompleteValueState,
} from '@base-ui/react/autocomplete';
export type { TRAutocompleteArrowProps } from './autocomplete-arrow.js';
export type { TRAutocompleteBackdropProps } from './autocomplete-backdrop.js';
export type { TRAutocompleteClearProps } from './autocomplete-clear.js';
export type { TRAutocompleteCollectionProps } from './autocomplete-collection.js';
export type { TRAutocompleteEmptyProps } from './autocomplete-empty.js';
export type { TRAutocompleteGroupProps } from './autocomplete-group.js';
export type { TRAutocompleteGroupLabelProps } from './autocomplete-group-label.js';
export type { TRAutocompleteIconProps } from './autocomplete-icon.js';
export type { TRAutocompleteInputProps } from './autocomplete-input.js';
export type { TRAutocompleteInputAdornmentProps } from './autocomplete-input-adornment.js';
export type { TRAutocompleteInputGroupProps } from './autocomplete-input-group.js';
export type { TRAutocompleteItemProps } from './autocomplete-item.js';
export type { TRAutocompleteListProps } from './autocomplete-list.js';
export type { TRAutocompletePopupProps } from './autocomplete-popup.js';
export type { TRAutocompletePortalProps } from './autocomplete-portal.js';
export type { TRAutocompletePositionerProps } from './autocomplete-positioner.js';
export type { TRAutocompleteRootProps } from './autocomplete-root.js';
export type { TRAutocompleteRowProps } from './autocomplete-row.js';
export type { TRAutocompleteSeparatorProps } from './autocomplete-separator.js';
export type { TRAutocompleteStatusProps } from './autocomplete-status.js';
export type { TRAutocompleteTriggerProps } from './autocomplete-trigger.js';
export type { TRAutocompleteValueProps } from './autocomplete-value.js';
export {
  TRAutocompleteArrow,
  TRAutocompleteBackdrop,
  TRAutocompleteClear,
  TRAutocompleteCollection,
  TRAutocompleteEmpty,
  TRAutocompleteGroup,
  TRAutocompleteGroupLabel,
  TRAutocompleteIcon,
  TRAutocompleteInput,
  TRAutocompleteInputAdornment,
  TRAutocompleteInputGroup,
  TRAutocompleteItem,
  TRAutocompleteList,
  TRAutocompletePopup,
  TRAutocompletePortal,
  TRAutocompletePositioner,
  TRAutocompleteRoot,
  TRAutocompleteRow,
  TRAutocompleteSeparator,
  TRAutocompleteStatus,
  TRAutocompleteTrigger,
  TRAutocompleteValue,
  useAutocompleteFilter,
  useAutocompleteFilteredItems,
};
