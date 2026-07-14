import { AutocompleteArrow } from './autocomplete-arrow.js';
import { AutocompleteBackdrop } from './autocomplete-backdrop.js';
import { AutocompleteClear } from './autocomplete-clear.js';
import { AutocompleteCollection } from './autocomplete-collection.js';
import { AutocompleteEmpty } from './autocomplete-empty.js';
import {
  useAutocompleteFilter,
  useAutocompleteFilteredItems,
} from './autocomplete-filter.js';
import { AutocompleteGroup } from './autocomplete-group.js';
import { AutocompleteGroupLabel } from './autocomplete-group-label.js';
import { AutocompleteIcon } from './autocomplete-icon.js';
import { AutocompleteInput } from './autocomplete-input.js';
import { AutocompleteInputAdornment } from './autocomplete-input-adornment.js';
import { AutocompleteInputGroup } from './autocomplete-input-group.js';
import { AutocompleteItem } from './autocomplete-item.js';
import { AutocompleteList } from './autocomplete-list.js';
import { AutocompletePopup } from './autocomplete-popup.js';
import { AutocompletePortal } from './autocomplete-portal.js';
import { AutocompletePositioner } from './autocomplete-positioner.js';
import { AutocompleteRoot } from './autocomplete-root.js';
import { AutocompleteRow } from './autocomplete-row.js';
import { AutocompleteSeparator } from './autocomplete-separator.js';
import { AutocompleteStatus } from './autocomplete-status.js';
import { AutocompleteTrigger } from './autocomplete-trigger.js';
import { AutocompleteValue } from './autocomplete-value.js';

export const Autocomplete = {
  Root: AutocompleteRoot,
  Value: AutocompleteValue,
  Trigger: AutocompleteTrigger,
  Input: AutocompleteInput,
  InputAdornment: AutocompleteInputAdornment,
  InputGroup: AutocompleteInputGroup,
  Icon: AutocompleteIcon,
  Clear: AutocompleteClear,
  List: AutocompleteList,
  Status: AutocompleteStatus,
  Portal: AutocompletePortal,
  Backdrop: AutocompleteBackdrop,
  Positioner: AutocompletePositioner,
  Popup: AutocompletePopup,
  Arrow: AutocompleteArrow,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Item: AutocompleteItem,
  Row: AutocompleteRow,
  Collection: AutocompleteCollection,
  Empty: AutocompleteEmpty,
  Separator: AutocompleteSeparator,
  useFilter: useAutocompleteFilter,
  useFilteredItems: useAutocompleteFilteredItems,
} as const;

export type {
  AutocompleteArrowState,
  AutocompleteBackdropState,
  AutocompleteClearState,
  AutocompleteCollectionState,
  AutocompleteEmptyState,
  AutocompleteGroupLabelState,
  AutocompleteGroupState,
  AutocompleteIconState,
  AutocompleteInputGroupState,
  AutocompleteInputState,
  AutocompleteItemState,
  AutocompleteListState,
  AutocompletePopupState,
  AutocompletePortalState,
  AutocompletePositionerState,
  AutocompleteRootState,
  AutocompleteRowState,
  AutocompleteStatusState,
  AutocompleteTriggerState,
  AutocompleteValueState,
} from '@base-ui/react/autocomplete';
export type { AutocompleteArrowProps } from './autocomplete-arrow.js';
export type { AutocompleteBackdropProps } from './autocomplete-backdrop.js';
export type { AutocompleteClearProps } from './autocomplete-clear.js';
export type { AutocompleteCollectionProps } from './autocomplete-collection.js';
export type { AutocompleteEmptyProps } from './autocomplete-empty.js';
export type { AutocompleteGroupProps } from './autocomplete-group.js';
export type { AutocompleteGroupLabelProps } from './autocomplete-group-label.js';
export type { AutocompleteIconProps } from './autocomplete-icon.js';
export type { AutocompleteInputProps } from './autocomplete-input.js';
export type { AutocompleteInputAdornmentProps } from './autocomplete-input-adornment.js';
export type { AutocompleteInputGroupProps } from './autocomplete-input-group.js';
export type { AutocompleteItemProps } from './autocomplete-item.js';
export type { AutocompleteListProps } from './autocomplete-list.js';
export type { AutocompletePopupProps } from './autocomplete-popup.js';
export type { AutocompletePortalProps } from './autocomplete-portal.js';
export type { AutocompletePositionerProps } from './autocomplete-positioner.js';
export type { AutocompleteRootProps } from './autocomplete-root.js';
export type { AutocompleteRowProps } from './autocomplete-row.js';
export type { AutocompleteSeparatorProps } from './autocomplete-separator.js';
export type { AutocompleteStatusProps } from './autocomplete-status.js';
export type { AutocompleteTriggerProps } from './autocomplete-trigger.js';
export type { AutocompleteValueProps } from './autocomplete-value.js';
export {
  AutocompleteArrow,
  AutocompleteBackdrop,
  AutocompleteClear,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteIcon,
  AutocompleteInput,
  AutocompleteInputAdornment,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompleteRoot,
  AutocompleteRow,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  AutocompleteValue,
  useAutocompleteFilter,
  useAutocompleteFilteredItems,
};
