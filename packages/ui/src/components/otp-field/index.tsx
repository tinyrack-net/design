import { TROTPFieldInput } from './otp-field-input.js';
import { TROTPFieldRoot } from './otp-field-root.js';
import { TROTPFieldSeparator } from './otp-field-separator.js';

export const TROTPField = {
  Root: TROTPFieldRoot,
  Input: TROTPFieldInput,
  Separator: TROTPFieldSeparator,
} as const;

export type {
  OTPFieldInputState as TROTPFieldInputState,
  OTPFieldRootState as TROTPFieldRootState,
} from '@base-ui/react/otp-field';
export type { TROTPFieldInputProps } from './otp-field-input.js';
export type { TROTPFieldRootProps } from './otp-field-root.js';
export type { TROTPFieldSeparatorProps } from './otp-field-separator.js';
export { TROTPFieldInput, TROTPFieldRoot, TROTPFieldSeparator };
