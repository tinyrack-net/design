import type { SurfaceEntry } from './types.js';

export class SurfaceStack {
  private readonly byElement = new Map<HTMLElement, SurfaceEntry>();
  private readonly ordered: SurfaceEntry[] = [];

  get entries(): readonly SurfaceEntry[] {
    return this.ordered;
  }

  add(entry: SurfaceEntry) {
    if (this.byElement.has(entry.element)) {
      return false;
    }
    this.byElement.set(entry.element, entry);
    this.ordered.push(entry);
    return true;
  }

  at(index: number) {
    return this.ordered.at(index) ?? null;
  }

  get(element: HTMLElement) {
    return this.byElement.get(element) ?? null;
  }

  remove(entry: SurfaceEntry) {
    if (this.byElement.get(entry.element) !== entry) {
      return false;
    }
    this.byElement.delete(entry.element);
    this.ordered.splice(this.ordered.indexOf(entry), 1);
    return true;
  }

  snapshot() {
    return this.ordered.slice();
  }
}
