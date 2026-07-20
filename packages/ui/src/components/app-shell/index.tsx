import { TRAppShellClose } from './app-shell-close.js';
import { TRAppShellHeader } from './app-shell-header.js';
import { TRAppShellMain } from './app-shell-main.js';
import { TRAppShellRoot } from './app-shell-root.js';
import { TRAppShellSidebar } from './app-shell-sidebar.js';
import { TRAppShellTrigger } from './app-shell-trigger.js';

export const TRAppShell = {
  Close: TRAppShellClose,
  Header: TRAppShellHeader,
  Main: TRAppShellMain,
  Root: TRAppShellRoot,
  Sidebar: TRAppShellSidebar,
  Trigger: TRAppShellTrigger,
} as const;

export type { TRAppShellCloseProps } from './app-shell-close.js';
export type {
  TRAppShellBreakpoint,
  TRAppShellLayout,
} from './app-shell-context.js';
export type { TRAppShellHeaderProps } from './app-shell-header.js';
export type { TRAppShellMainProps } from './app-shell-main.js';
export type { TRAppShellRootProps } from './app-shell-root.js';
export type { TRAppShellSidebarProps } from './app-shell-sidebar.js';
export type { TRAppShellTriggerProps } from './app-shell-trigger.js';
export {
  TRAppShellClose,
  TRAppShellHeader,
  TRAppShellMain,
  TRAppShellRoot,
  TRAppShellSidebar,
  TRAppShellTrigger,
};
