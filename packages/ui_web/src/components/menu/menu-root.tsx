'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuRootProps<Payload = unknown> = BaseMenu.Root.Props<Payload>;
export const TRMenuRoot = createComponentPart(BaseMenu.Root) as typeof BaseMenu.Root;
