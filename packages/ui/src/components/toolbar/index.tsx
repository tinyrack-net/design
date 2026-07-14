import { ToolbarButton } from './toolbar-button.js';
import { ToolbarGroup } from './toolbar-group.js';
import { ToolbarInput } from './toolbar-input.js';
import { ToolbarLink } from './toolbar-link.js';
import { ToolbarRoot } from './toolbar-root.js';
import { ToolbarSeparator } from './toolbar-separator.js';

export const Toolbar = {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Button: ToolbarButton,
  Link: ToolbarLink,
  Input: ToolbarInput,
  Separator: ToolbarSeparator,
} as const;

export type {
  ToolbarButtonState,
  ToolbarGroupState,
  ToolbarInputState,
  ToolbarLinkState,
  ToolbarRootState,
  ToolbarSeparatorState,
} from '@base-ui/react/toolbar';
export type { ToolbarButtonProps } from './toolbar-button.js';
export type { ToolbarGroupProps } from './toolbar-group.js';
export type { ToolbarInputProps } from './toolbar-input.js';
export type { ToolbarLinkProps } from './toolbar-link.js';
export type { ToolbarRootProps } from './toolbar-root.js';
export type { ToolbarSeparatorProps } from './toolbar-separator.js';
export {
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarRoot,
  ToolbarSeparator,
};
