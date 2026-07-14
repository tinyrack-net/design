'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxPortalProps = ComponentProps<typeof BaseCombobox.Portal>;
export const ComboboxPortal = createComponentPart(BaseCombobox.Portal);
