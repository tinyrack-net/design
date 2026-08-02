'use client';

import { createContext } from 'react';

export const AutocompleteResetContext = createContext<(() => void) | null>(null);
