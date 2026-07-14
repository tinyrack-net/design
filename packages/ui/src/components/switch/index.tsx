import { SwitchRoot } from './switch-root.js';
import { SwitchThumb } from './switch-thumb.js';

export const Switch = {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
} as const;

export type {
  SwitchRootState,
  SwitchThumbState,
} from '@base-ui/react/switch';
export type { SwitchRootProps } from './switch-root.js';
export type { SwitchThumbProps } from './switch-thumb.js';
export { SwitchRoot, SwitchThumb };
