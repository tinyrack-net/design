'use client';

import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TROTPFieldInputProps = ComponentProps<typeof BaseOTPField.Input>;
export const TROTPFieldInput = createComponentPart(
  BaseOTPField.Input,
  'tr-otp-field-digit',
);
