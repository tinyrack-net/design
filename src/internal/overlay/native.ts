export function isHTMLElement(value: unknown): value is HTMLElement {
  return typeof HTMLElement !== 'undefined' && value instanceof HTMLElement;
}

export function isModal(element: HTMLElement): element is HTMLDialogElement {
  return element.tagName === 'DIALOG';
}

export function isModalOpen(element: HTMLDialogElement) {
  return element.open && element.matches(':modal');
}

export function isPopover(element: HTMLElement) {
  return element.hasAttribute('popover');
}

export function isPopoverOpen(element: HTMLElement) {
  return element.matches(':popover-open');
}

export function isSurfaceOpen(element: HTMLElement) {
  return isModal(element) ? isModalOpen(element) : isPopoverOpen(element);
}

export function openNativeSurface(element: HTMLElement, source: HTMLElement | null) {
  if (isModal(element)) {
    if (element.open && !isModalOpen(element)) element.close();
    element.showModal();
    return true;
  }
  if (isPopover(element)) {
    element.showPopover(source === null ? undefined : { source });
    return true;
  }
  return false;
}

export function closeNativeSurface(element: HTMLElement) {
  if (isModal(element)) {
    if (element.open) element.close();
    return true;
  }
  if (isPopover(element)) {
    if (isPopoverOpen(element)) element.hidePopover();
    return true;
  }
  return false;
}

export function supportsDialogCommands(document: Document) {
  const Button = document.defaultView?.HTMLButtonElement;
  return Button !== undefined && 'commandForElement' in Button.prototype;
}

export function supportsPopoverCommands(document: Document) {
  const Button = document.defaultView?.HTMLButtonElement;
  return Button !== undefined && 'popoverTargetElement' in Button.prototype;
}
