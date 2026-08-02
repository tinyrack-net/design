import type { ComponentPropsWithRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRInputActionProps = ComponentPropsWithRef<'button'>;

/**
 * A control at the edge of a `Group` — reveal a password, clear the value, run
 * a search.
 *
 * Defaults to `type="button"` so it cannot accidentally submit the surrounding
 * form. It is a real button and stays in the tab order, so give it an
 * accessible name.
 */
export function TRInputAction({
  className,
  type = 'button',
  ...props
}: TRInputActionProps) {
  return (
    <button
      {...props}
      className={mergeClassNames('tr-input-group-action', className)}
      type={type}
    />
  );
}
