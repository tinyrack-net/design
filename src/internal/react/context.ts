export function requireComponentContext<T>(
  context: T | null,
  componentName: string,
  ownerName: string,
) {
  if (context === null) {
    throw new Error(`${componentName} must be used within ${ownerName}.`);
  }

  return context;
}
