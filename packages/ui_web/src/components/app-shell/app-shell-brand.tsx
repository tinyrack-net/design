import type { ComponentPropsWithRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAppShellBrandProps = ComponentPropsWithRef<'div'>;

export function TRAppShellBrand({ className, ...props }: TRAppShellBrandProps) {
  return (
    <div {...props} className={mergeClassNames('tr-app-shell-brand', className)} />
  );
}
