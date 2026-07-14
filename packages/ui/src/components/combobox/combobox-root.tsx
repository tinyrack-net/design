'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps, ReactElement } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxRootProps = ComponentProps<typeof BaseCombobox.Root>;
export const ComboboxRoot: (props: ComboboxRootProps) => ReactElement | null =
  createComponentPart(BaseCombobox.Root);
