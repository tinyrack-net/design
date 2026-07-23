import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRWindowFrameControl } from './window-frame-control.js';

export type TRWindowFrameControlsProps = ComponentProps<'div'>;

export function TRWindowFrameControls({
  'aria-hidden': ariaHidden = true,
  children,
  className,
  ...props
}: TRWindowFrameControlsProps) {
  return (
    <div
      {...props}
      aria-hidden={ariaHidden}
      className={mergeClassNames('tr-window-frame-controls', className)}
    >
      {children ?? (
        <>
          <TRWindowFrameControl tone="close" />
          <TRWindowFrameControl tone="minimize" />
          <TRWindowFrameControl tone="maximize" />
        </>
      )}
    </div>
  );
}
