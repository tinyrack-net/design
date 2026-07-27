const warned = new Set<string>();

/**
 * Reports a message at most once per key for the lifetime of the module.
 *
 * Not gated on `NODE_ENV`: the package ships no build-time defines, and the
 * conditions this reports are faults in production too.
 */
export function warnOnce(key: string, message: string, ...details: unknown[]) {
  if (warned.has(key)) return;
  warned.add(key);
  console.error(message, ...details);
}
