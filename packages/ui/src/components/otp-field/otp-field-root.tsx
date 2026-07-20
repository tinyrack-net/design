'use client';

import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TROTPFieldRootProps = ComponentProps<typeof BaseOTPField.Root>;
export const TROTPFieldRoot = createComponentPart(BaseOTPField.Root, 'tr-otp-field');
