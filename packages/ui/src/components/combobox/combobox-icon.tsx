'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxIconProps = ComponentProps<typeof BaseCombobox.Icon>;
export const ComboboxIcon = createComponentPart(BaseCombobox.Icon, 'tr-combobox-icon');
