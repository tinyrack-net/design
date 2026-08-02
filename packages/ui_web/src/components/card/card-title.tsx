'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRCardTitleProps = useRender.ComponentProps<'h2'>;

export function TRCardTitle({ className, ref, render, ...props }: TRCardTitleProps) {
  return useRender({
    defaultTagName: 'h2',
    props: {
      ...props,
      className: mergeClassNames('tr-card-title', className),
    },
    ref,
    render,
  });
}
