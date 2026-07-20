'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxPortalProps = ComponentProps<typeof BaseCombobox.Portal>;
export const TRComboboxPortal = createComponentPart(BaseCombobox.Portal);
