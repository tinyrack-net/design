import { TRSwitchRoot } from './switch-root.js';
import { TRSwitchThumb } from './switch-thumb.js';

export const TRSwitch = {
  Root: TRSwitchRoot,
  Thumb: TRSwitchThumb,
} as const;

export type {
  SwitchRootState as TRSwitchRootState,
  SwitchThumbState as TRSwitchThumbState,
} from '@base-ui/react/switch';
export type { TRSwitchRootProps } from './switch-root.js';
export type { TRSwitchThumbProps } from './switch-thumb.js';
export { TRSwitchRoot, TRSwitchThumb };
