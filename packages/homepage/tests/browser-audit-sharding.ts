export const browserAuditShardCount = 4;

const configuredShard = process.env['TINYRACK_HOMEPAGE_E2E_SHARD'];
const activeShard = configuredShard === undefined ? undefined : Number(configuredShard);

if (
  activeShard !== undefined &&
  (!Number.isInteger(activeShard) ||
    activeShard < 0 ||
    activeShard >= browserAuditShardCount)
) {
  throw new Error(
    `TINYRACK_HOMEPAGE_E2E_SHARD must be between 0 and ${browserAuditShardCount - 1}`,
  );
}

export function isBrowserAuditShardSelected(shard: number) {
  return activeShard === undefined || activeShard === shard;
}

export function browserAuditShardCases<const Value>(values: readonly Value[]) {
  if (activeShard === undefined) return values;
  return values.filter((_, index) => index % browserAuditShardCount === activeShard);
}
