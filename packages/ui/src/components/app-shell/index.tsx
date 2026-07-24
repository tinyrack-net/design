import { TRAppShellActions } from './app-shell-actions.js';
import { TRAppShellBrand } from './app-shell-brand.js';
import { TRAppShellClose } from './app-shell-close.js';
import { TRAppShellHeader } from './app-shell-header.js';
import { TRAppShellMain } from './app-shell-main.js';
import { TRAppShellOutline } from './app-shell-outline.js';
import { TRAppShellRoot } from './app-shell-root.js';
import { TRAppShellSidebar } from './app-shell-sidebar.js';
import { TRAppShellSidebarLabel } from './app-shell-sidebar-label.js';
import { TRAppShellSidebarToggle } from './app-shell-sidebar-toggle.js';
import { TRAppShellTrigger } from './app-shell-trigger.js';

export const TRAppShell = {
  Actions: TRAppShellActions,
  Brand: TRAppShellBrand,
  Close: TRAppShellClose,
  Header: TRAppShellHeader,
  Main: TRAppShellMain,
  Outline: TRAppShellOutline,
  Root: TRAppShellRoot,
  Sidebar: TRAppShellSidebar,
  SidebarLabel: TRAppShellSidebarLabel,
  SidebarToggle: TRAppShellSidebarToggle,
  Trigger: TRAppShellTrigger,
} as const;

export type { TRAppShellActionsProps } from './app-shell-actions.js';
export type { TRAppShellBrandProps } from './app-shell-brand.js';
export type { TRAppShellCloseProps } from './app-shell-close.js';
export type {
  TRAppShellBreakpoint,
  TRAppShellChrome,
  TRAppShellLayout,
  TRAppShellMobileSidebar,
  TRAppShellNavigationKind,
  TRAppShellSidebarMode,
} from './app-shell-context.js';
export type { TRAppShellHeaderProps } from './app-shell-header.js';
export type { TRAppShellMainProps } from './app-shell-main.js';
export type { TRAppShellOutlineProps } from './app-shell-outline.js';
export type { TRAppShellRootProps } from './app-shell-root.js';
export type { TRAppShellSidebarProps } from './app-shell-sidebar.js';
export type { TRAppShellSidebarLabelProps } from './app-shell-sidebar-label.js';
export type { TRAppShellSidebarToggleProps } from './app-shell-sidebar-toggle.js';
export type { TRAppShellTriggerProps } from './app-shell-trigger.js';
export {
  TRAppShellActions,
  TRAppShellBrand,
  TRAppShellClose,
  TRAppShellHeader,
  TRAppShellMain,
  TRAppShellOutline,
  TRAppShellRoot,
  TRAppShellSidebar,
  TRAppShellSidebarLabel,
  TRAppShellSidebarToggle,
  TRAppShellTrigger,
};
