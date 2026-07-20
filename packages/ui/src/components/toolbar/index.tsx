import { TRToolbarButton } from './toolbar-button.js';
import { TRToolbarGroup } from './toolbar-group.js';
import { TRToolbarInput } from './toolbar-input.js';
import { TRToolbarLink } from './toolbar-link.js';
import { TRToolbarRoot } from './toolbar-root.js';
import { TRToolbarSeparator } from './toolbar-separator.js';

export const TRToolbar = {
  Root: TRToolbarRoot,
  Group: TRToolbarGroup,
  Button: TRToolbarButton,
  Link: TRToolbarLink,
  Input: TRToolbarInput,
  Separator: TRToolbarSeparator,
} as const;

export type {
  ToolbarButtonState as TRToolbarButtonState,
  ToolbarGroupState as TRToolbarGroupState,
  ToolbarInputState as TRToolbarInputState,
  ToolbarLinkState as TRToolbarLinkState,
  ToolbarRootState as TRToolbarRootState,
  ToolbarSeparatorState as TRToolbarSeparatorState,
} from '@base-ui/react/toolbar';
export type { TRToolbarButtonProps } from './toolbar-button.js';
export type { TRToolbarGroupProps } from './toolbar-group.js';
export type { TRToolbarInputProps } from './toolbar-input.js';
export type { TRToolbarLinkProps } from './toolbar-link.js';
export type { TRToolbarRootProps } from './toolbar-root.js';
export type { TRToolbarSeparatorProps } from './toolbar-separator.js';
export {
  TRToolbarButton,
  TRToolbarGroup,
  TRToolbarInput,
  TRToolbarLink,
  TRToolbarRoot,
  TRToolbarSeparator,
};
