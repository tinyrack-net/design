'use client';

import { createContext, useContext } from 'react';

/**
 * Lets an `Input` discover that it is rendered inside a `Group` so it can take
 * the group's control styling itself. Without it a caller would have to write
 * the internal `tr-input-group-input` class by hand, which is the thing the
 * group is meant to spare them.
 */
export const TRInputGroupContext = createContext(false);

export function useIsInsideTRInputGroup(): boolean {
  return useContext(TRInputGroupContext);
}
