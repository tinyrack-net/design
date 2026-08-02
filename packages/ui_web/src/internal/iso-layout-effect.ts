'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` that degrades to `useEffect` on the server, so components
 * that must run before paint do not warn during server rendering.
 */
export const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;
