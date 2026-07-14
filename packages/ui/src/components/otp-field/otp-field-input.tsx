'use client';

import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type OTPFieldInputProps = ComponentProps<typeof BaseOTPField.Input>;
export const OTPFieldInput = createComponentPart(
  BaseOTPField.Input,
  'tr-otp-field-digit',
);
