import {
  DocsShellActions,
  DocsShellBrand,
  DocsShellHeader,
  DocsShellMain,
  DocsShellOutline,
  DocsShellRoot,
  DocsShellSidebar,
} from './docs-shell.js';

export const DocsShell = {
  Actions: DocsShellActions,
  Brand: DocsShellBrand,
  Header: DocsShellHeader,
  Main: DocsShellMain,
  Outline: DocsShellOutline,
  Root: DocsShellRoot,
  Sidebar: DocsShellSidebar,
} as const;

export type {
  DocsShellActionsProps,
  DocsShellBrandProps,
  DocsShellHeaderProps,
  DocsShellLayout,
  DocsShellMainProps,
  DocsShellNavigationKind,
  DocsShellOutlineProps,
  DocsShellRootProps,
  DocsShellSidebarProps,
} from './docs-shell.js';
export {
  DocsShellActions,
  DocsShellBrand,
  DocsShellHeader,
  DocsShellMain,
  DocsShellOutline,
  DocsShellRoot,
  DocsShellSidebar,
};
