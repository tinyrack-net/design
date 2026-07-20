'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAppShellMainProps = useRender.ComponentProps<'main'>;

export function TRAppShellMain({
  className,
  ref,
  render,
  ...props
}: TRAppShellMainProps) {
  return useRender({
    defaultTagName: 'main',
    props: { ...props, className: mergeClassNames('tr-app-shell-main', className) },
    ref,
    render,
  });
}
