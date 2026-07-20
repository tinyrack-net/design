'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxRowProps = ComponentProps<typeof BaseCombobox.Row>;
export const TRComboboxRow = createComponentPart(BaseCombobox.Row, 'tr-combobox-row');
