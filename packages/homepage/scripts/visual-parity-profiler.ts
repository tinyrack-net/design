import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { performance } from 'node:perf_hooks';

type Phase = {
  count: number;
  maximumMs: number;
  totalMs: number;
};

export class VisualParityProfiler {
  readonly #phases = new Map<string, Phase>();
  readonly #startedAt = performance.now();

  async measure<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const startedAt = performance.now();
    try {
      return await operation();
    } finally {
      this.record(name, performance.now() - startedAt);
    }
  }

  record(name: string, durationMs: number) {
    const phase = this.#phases.get(name) ?? {
      count: 0,
      maximumMs: 0,
      totalMs: 0,
    };
    phase.count += 1;
    phase.maximumMs = Math.max(phase.maximumMs, durationMs);
    phase.totalMs += durationMs;
    this.#phases.set(name, phase);
  }

  snapshot() {
    return {
      elapsedMs: performance.now() - this.#startedAt,
      phases: Object.fromEntries(
        [...this.#phases.entries()].map(([name, phase]) => [
          name,
          {
            ...phase,
            averageMs: phase.totalMs / phase.count,
          },
        ]),
      ),
    };
  }

  async write(path: string, metadata: Record<string, unknown>) {
    const report = { ...metadata, ...this.snapshot() };
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify(report, null, 2)}\n`);
    return report;
  }
}
