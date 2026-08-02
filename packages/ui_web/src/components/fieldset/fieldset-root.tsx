'use client';

import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRFieldsetRootProps = ComponentProps<typeof BaseFieldset.Root>;
export const TRFieldsetRoot = createComponentPart(BaseFieldset.Root, 'tr-fieldset');
