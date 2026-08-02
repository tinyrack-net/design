'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRCardRootProps = useRender.ComponentProps<'div'> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'elevated';
};

export function TRCardRoot({
  className,
  padding = 'md',
  ref,
  render,
  variant = 'default',
  ...props
}: TRCardRootProps) {
  return useRender({
    defaultTagName: 'div',
    props: {
      ...props,
      className: mergeClassNames('tr-card', className),
      'data-padding': padding,
      'data-variant': variant,
    },
    ref,
    render,
  });
}
