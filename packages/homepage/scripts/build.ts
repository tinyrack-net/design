import { spawn } from 'node:child_process';
import { availableParallelism } from 'node:os';
import { packageManagerCommand } from '../../../scripts/package-manager-command.ts';

type Command = {
  args: string[];
  command: string;
  label: string;
};

function pnpm(args: string[], label: string): Command {
  return { ...packageManagerCommand(args), label };
}

function run({ args, command, label }: Command, env = process.env) {
  const startedAt = Date.now();
  console.log(`\n[homepage:build] ${label}`);
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { env, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      const seconds = ((Date.now() - startedAt) / 1_000).toFixed(1);
      if (code === 0) {
        console.log(`[homepage:build] ${label} completed in ${seconds}s`);
        resolve();
        return;
      }
      reject(
        new Error(
          `${label} failed after ${seconds}s (${signal === null ? `exit ${code ?? 1}` : `signal ${signal}`})`,
        ),
      );
    });
  });
}

async function runParallel(commands: Command[]) {
  const results = await Promise.allSettled(commands.map((command) => run(command)));
  const failures = results.flatMap((result) =>
    result.status === 'rejected' ? [result.reason] : [],
  );
  if (failures.length > 0) {
    throw new AggregateError(failures, 'Homepage build preflight failed');
  }
}

await run(pnpm(['exec', 'react-router', 'typegen'], 'Generate React Router types'));

await runParallel([
  pnpm(
    ['exec', 'tsc', '-p', 'tsconfig.build.json', '--noEmit'],
    'Check application types',
  ),
  pnpm(['exec', 'tsc', '-p', 'tsconfig.test.json', '--noEmit'], 'Check test types'),
  {
    args: ['scripts/sync-brand.ts', '--check'],
    command: process.execPath,
    label: 'Check synchronized brand assets',
  },
]);

const processors = Math.max(1, availableParallelism());
const assetWorkers = 1;
const prerenderWorkers = Math.max(1, Math.min(8, processors - assetWorkers));
console.log(
  `[homepage:build] resource budget: ${processors} processors, ${assetWorkers} asset worker, ${prerenderWorkers} prerender workers`,
);

await run(pnpm(['exec', 'react-router', 'build'], 'Build and prerender Homepage'), {
  ...process.env,
  TINYRACK_DOCS_ASSET_WORKERS: String(assetWorkers),
  TINYRACK_DOCS_PRERENDER_WORKERS: String(prerenderWorkers),
});
