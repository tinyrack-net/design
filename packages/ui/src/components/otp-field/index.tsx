import { OTPFieldInput } from './otp-field-input.js';
import { OTPFieldRoot } from './otp-field-root.js';
import { OTPFieldSeparator } from './otp-field-separator.js';

export const OTPField = {
  Root: OTPFieldRoot,
  Input: OTPFieldInput,
  Separator: OTPFieldSeparator,
} as const;

export type {
  OTPFieldInputState,
  OTPFieldRootState,
} from '@base-ui/react/otp-field';
export type { OTPFieldInputProps } from './otp-field-input.js';
export type { OTPFieldRootProps } from './otp-field-root.js';
export type { OTPFieldSeparatorProps } from './otp-field-separator.js';
export { OTPFieldInput, OTPFieldRoot, OTPFieldSeparator };
