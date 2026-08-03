import { availableParallelism } from 'node:os';

export function resolveVisualParityConcurrency(
  logicalProcessors = availableParallelism(),
  mode = process.env['TINYRACK_VISUAL_PARITY'],
) {
  if (!Number.isFinite(logicalProcessors) || logicalProcessors < 1) return 1;
  const available = Math.floor(logicalProcessors);
  const stableSessionLimit = mode === 'motion' ? 4 : 12;
  const requested = Number(process.env['TINYRACK_VISUAL_PARITY_SESSIONS']);
  if (Number.isInteger(requested) && requested > 0) {
    return Math.min(available, stableSessionLimit, requested);
  }
  // Motion jobs drive two virtual-clock pages per browser context. Beyond
  // four contexts, Chromium/CanvasKit renderer contention makes sampled frames
  // nondeterministic even when more logical processors are available.
  return mode === 'motion'
    ? Math.min(available, 4)
    : Math.max(1, Math.min(12, Math.floor(available * 0.75)));
}

export function resolveVisualParityComparisonWorkers(
  logicalProcessors = availableParallelism(),
  mode = process.env['TINYRACK_VISUAL_PARITY'],
) {
  if (!Number.isFinite(logicalProcessors) || logicalProcessors < 1) return 1;
  const available = Math.floor(logicalProcessors);
  const sessions = resolveVisualParityConcurrency(available, mode);
  return Math.max(1, Math.min(sessions, available - sessions));
}

export function partitionVisualParityWork<T>(
  values: readonly T[],
  maximumShardSize: number,
) {
  if (!Number.isInteger(maximumShardSize) || maximumShardSize < 1) {
    throw new RangeError('maximumShardSize must be a positive integer.');
  }
  const shards: T[][] = [];
  for (let index = 0; index < values.length; index += maximumShardSize) {
    shards.push(values.slice(index, index + maximumShardSize));
  }
  return shards;
}
