import { availableParallelism } from 'node:os';

export function resolveVisualParityConcurrency(
  logicalProcessors = availableParallelism(),
  mode = process.env['TINYRACK_VISUAL_PARITY'],
) {
  if (!Number.isFinite(logicalProcessors) || logicalProcessors < 1) return 1;
  const available = Math.floor(logicalProcessors);
  const requested = Number(process.env['TINYRACK_VISUAL_PARITY_SESSIONS']);
  if (Number.isInteger(requested) && requested > 0) {
    return Math.min(available, mode === 'motion' ? 8 : requested);
  }
  // Motion jobs drive two virtual-clock pages per browser context. Beyond
  // eight contexts, Chromium renderer contention makes sampled frames
  // nondeterministic even when more logical processors are available.
  return mode === 'motion'
    ? Math.min(available, 8)
    : Math.max(1, Math.floor(available * 0.75));
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
