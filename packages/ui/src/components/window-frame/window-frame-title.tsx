'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRWindowFrameTitleProps = useRender.ComponentProps<'span'>;

export function TRWindowFrameTitle({
  className,
  ref,
  render,
  ...props
}: TRWindowFrameTitleProps) {
  return useRender({
    defaultTagName: 'span',
    props: {
      ...props,
      className: mergeClassNames('tr-window-frame-title', className),
    },
    ref,
    render,
  });
}
