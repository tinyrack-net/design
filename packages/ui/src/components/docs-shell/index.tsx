import {
  TRDocsShellActions,
  TRDocsShellBrand,
  TRDocsShellHeader,
  TRDocsShellMain,
  TRDocsShellOutline,
  TRDocsShellRoot,
  TRDocsShellSidebar,
} from './docs-shell.js';

export const TRDocsShell = {
  Actions: TRDocsShellActions,
  Brand: TRDocsShellBrand,
  Header: TRDocsShellHeader,
  Main: TRDocsShellMain,
  Outline: TRDocsShellOutline,
  Root: TRDocsShellRoot,
  Sidebar: TRDocsShellSidebar,
} as const;

export type {
  TRDocsShellActionsProps,
  TRDocsShellBrandProps,
  TRDocsShellHeaderProps,
  TRDocsShellLayout,
  TRDocsShellMainProps,
  TRDocsShellNavigationKind,
  TRDocsShellOutlineProps,
  TRDocsShellRootProps,
  TRDocsShellSidebarProps,
} from './docs-shell.js';
export {
  TRDocsShellActions,
  TRDocsShellBrand,
  TRDocsShellHeader,
  TRDocsShellMain,
  TRDocsShellOutline,
  TRDocsShellRoot,
  TRDocsShellSidebar,
};
