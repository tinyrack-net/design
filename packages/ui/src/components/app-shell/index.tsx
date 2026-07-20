import { TRAppShellClose } from './app-shell-close.js';
import { TRAppShellHeader } from './app-shell-header.js';
import { TRAppShellMain } from './app-shell-main.js';
import { TRAppShellRoot } from './app-shell-root.js';
import { TRAppShellSidebar } from './app-shell-sidebar.js';
import { TRAppShellSidebarLabel } from './app-shell-sidebar-label.js';
import { TRAppShellSidebarToggle } from './app-shell-sidebar-toggle.js';
import { TRAppShellTrigger } from './app-shell-trigger.js';

export const TRAppShell = {
  Close: TRAppShellClose,
  Header: TRAppShellHeader,
  Main: TRAppShellMain,
  Root: TRAppShellRoot,
  Sidebar: TRAppShellSidebar,
  SidebarLabel: TRAppShellSidebarLabel,
  SidebarToggle: TRAppShellSidebarToggle,
  Trigger: TRAppShellTrigger,
} as const;

export type { TRAppShellCloseProps } from './app-shell-close.js';
export type {
  TRAppShellBreakpoint,
  TRAppShellLayout,
  TRAppShellMobileSidebar,
  TRAppShellSidebarMode,
} from './app-shell-context.js';
export type { TRAppShellHeaderProps } from './app-shell-header.js';
export type { TRAppShellMainProps } from './app-shell-main.js';
export type { TRAppShellRootProps } from './app-shell-root.js';
export type { TRAppShellSidebarProps } from './app-shell-sidebar.js';
export type { TRAppShellSidebarLabelProps } from './app-shell-sidebar-label.js';
export type { TRAppShellSidebarToggleProps } from './app-shell-sidebar-toggle.js';
export type { TRAppShellTriggerProps } from './app-shell-trigger.js';
export {
  TRAppShellClose,
  TRAppShellHeader,
  TRAppShellMain,
  TRAppShellRoot,
  TRAppShellSidebar,
  TRAppShellSidebarLabel,
  TRAppShellSidebarToggle,
  TRAppShellTrigger,
};
