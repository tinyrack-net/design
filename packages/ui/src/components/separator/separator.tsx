import { Separator as BaseSeparator } from '@base-ui/react/separator';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSeparatorProps = ComponentProps<typeof BaseSeparator>;
export const TRSeparator = createComponentPart(BaseSeparator, 'tr-separator');
