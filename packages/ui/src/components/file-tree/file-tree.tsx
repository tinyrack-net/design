import type { ComponentPropsWithRef, ReactNode } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type FileTreeRootProps = ComponentPropsWithRef<'ul'>;
export type FileTreeFileProps = ComponentPropsWithRef<'li'>;
export type FileTreeDirectoryProps = Omit<ComponentPropsWithRef<'li'>, 'children'> & {
  children?: ReactNode;
  defaultOpen?: boolean;
  name: ReactNode;
};

export function FileTreeRoot({ className, ...props }: FileTreeRootProps) {
  return <ul {...props} className={mergeClassNames('tr-file-tree', className)} />;
}

export function FileTreeFile({ className, ...props }: FileTreeFileProps) {
  return <li {...props} className={mergeClassNames('tr-file-tree-file', className)} />;
}

export function FileTreeDirectory({
  children,
  className,
  defaultOpen = true,
  name,
  ...props
}: FileTreeDirectoryProps) {
  return (
    <li {...props} className={mergeClassNames('tr-file-tree-directory', className)}>
      <details open={defaultOpen}>
        <summary>{name}</summary>
        {children}
      </details>
    </li>
  );
}
