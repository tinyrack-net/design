import type { ComponentPropsWithRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRInputAdornmentProps = ComponentPropsWithRef<'span'> & {
  side?: 'end' | 'start';
};

/**
 * Static content inside a `Group` — a leading icon, a unit, a prefix.
 *
 * Not interactive: it does not take pointer events, so clicking it still
 * focuses the input. Use `Action` for something the user can press, and mark
 * decorative icons `aria-hidden` so the field keeps a single accessible name.
 */
export function TRInputAdornment({
  className,
  side = 'start',
  ...props
}: TRInputAdornmentProps) {
  return (
    <span
      {...props}
      className={mergeClassNames('tr-input-group-adornment', className)}
      data-side={side}
    />
  );
}
