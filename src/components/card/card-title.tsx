'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type CardTitleProps = useRender.ComponentProps<'h2'>;

export function CardTitle({ className, ref, render, ...props }: CardTitleProps) {
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
