'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAlertTitleProps = useRender.ComponentProps<'div'>;

export function TRAlertTitle({ className, ref, render, ...props }: TRAlertTitleProps) {
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
