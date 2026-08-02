import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRWindowFrameControlTone = 'close' | 'minimize' | 'maximize';

export type TRWindowFrameControlProps = ComponentProps<'div'> & {
  tone?: TRWindowFrameControlTone;
};

export function TRWindowFrameControl({
  className,
  tone = 'close',
  ...props
}: TRWindowFrameControlProps) {
  return (
    <div
      {...props}
      className={mergeClassNames('tr-window-frame-control', className)}
      data-tone={tone}
    />
  );
}
