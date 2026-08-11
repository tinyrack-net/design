#!/usr/bin/env node

import { checkTinyrackProject, formatTinyrackCheckResult } from './tinyrack-check.js';

function valueAfter(flag: string) {
  const direct = process.argv.find((argument) => argument.startsWith(`${flag}=`));
  if (direct !== undefined) return direct.slice(flag.length + 1);
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
  const format = valueAfter('--format') ?? 'pretty';
  if (!['github', 'json', 'pretty'].includes(format)) {
    throw new Error(`Unknown output format: ${format}`);
  }
  const result = await checkTinyrackProject({
    configPath: valueAfter('--config'),
    root: valueAfter('--root') ?? process.cwd(),
  });
  process.stdout.write(
    `${formatTinyrackCheckResult(result, format as 'github' | 'json' | 'pretty')}\n`,
  );
  process.exitCode = result.violations.length === 0 ? 0 : 1;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`tinyrack-ui-check: ${message}\n`);
  process.exitCode = 2;
});
