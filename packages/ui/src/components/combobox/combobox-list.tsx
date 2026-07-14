'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxListProps = ComponentProps<typeof BaseCombobox.List>;
export const ComboboxList = createComponentPart(BaseCombobox.List, 'tr-combobox-list');
