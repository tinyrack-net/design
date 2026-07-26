import { TRInput as TRInputRoot } from './input.js';
import { TRInputAction } from './input-action.js';
import { TRInputAdornment } from './input-adornment.js';
import { TRInputGroup } from './input-group.js';

/**
 * `TRInput` stays directly renderable for the common single-control case and
 * carries the group parts as a namespace, so adding an adornment never means
 * changing the element you already render.
 */
export const TRInput = Object.assign(TRInputRoot, {
  Group: TRInputGroup,
  Adornment: TRInputAdornment,
  Action: TRInputAction,
});

export type { InputState as TRInputState } from '@base-ui/react/input';
export type { TRInputProps, TRInputUiSize } from './input.js';
export type { TRInputActionProps } from './input-action.js';
export type { TRInputAdornmentProps } from './input-adornment.js';
export type { TRInputGroupProps } from './input-group.js';
export { TRInputAction, TRInputAdornment, TRInputGroup };
