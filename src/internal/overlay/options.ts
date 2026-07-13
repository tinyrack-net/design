export function dataBoolean(element: HTMLElement, name: string, fallback: boolean) {
  const value = element.dataset[name];
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

export function dataNumber(element: HTMLElement, name: string, fallback: number) {
  const value = Number(element.dataset[name]);
  return Number.isFinite(value) ? value : fallback;
}
