'use client';

import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type FieldsetRootProps = ComponentProps<typeof BaseFieldset.Root>;
export const FieldsetRoot = createComponentPart(BaseFieldset.Root, 'tr-fieldset');
