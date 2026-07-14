'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type AlertTitleProps = useRender.ComponentProps<'div'>;

export function AlertTitle({ className, ref, render, ...props }: AlertTitleProps) {
  return useRender({
    defaultTagName: 'div',
    props: {
      ...props,
      className: mergeClassNames('tr-alert-title', className),
    },
    ref,
    render,
  });
}
