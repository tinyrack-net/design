'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRWindowFrameRootProps = useRender.ComponentProps<'div'> & {
  variant?: 'macos' | 'browser';
};

export function TRWindowFrameRoot({
  className,
  ref,
  render,
  variant = 'macos',
  ...props
}: TRWindowFrameRootProps) {
  return useRender({
    defaultTagName: 'div',
    props: {
      ...props,
      className: mergeClassNames('tr-window-frame', className),
      'data-variant': variant,
    },
    ref,
    render,
  });
}
