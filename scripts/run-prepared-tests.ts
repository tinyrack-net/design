import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { packageManagerCommand } from './package-manager-command.ts';

const workspaceRoot = resolve(import.meta.dirname, '..');
const preparedDirectory = mkdtempSync(resolve(tmpdir(), 'tinyrack-prepared-'));

function runPnpm(args: readonly string[], env: NodeJS.ProcessEnv = process.env) {
  const { args: commandArgs, command } = packageManagerCommand(args);

  return spawnSync(command, commandArgs, {
    cwd: workspaceRoot,
    env,
    stdio: 'inherit',
  }).status;
}

try {
  const packStatus = runPnpm([
    '--config.ignore-scripts=true',
    '--dir',
    'packages/ui',
    'pack',
    '--pack-destination',
    preparedDirectory,
  ]);

  if (packStatus !== 0) {
    process.exitCode = packStatus ?? 1;
  } else {
    const archives = readdirSync(preparedDirectory).filter((file) =>
      file.endsWith('.tgz'),
    );
    if (archives.length !== 1) {
      throw new Error(`Expected one prepared UI archive, found ${archives.length}.`);
    }
    const archive = archives[0];
    if (archive === undefined) throw new Error('Prepared UI archive is missing.');

    process.exitCode =
      runPnpm(
        [
          '--parallel',
          '--no-bail',
          '--filter',
          '@tinyrack/ui',
          '--filter',
          '@tinyrack/docs',
          '--filter',
          '@tinyrack/homepage',
          'test:prepared',
        ],
        {
          ...process.env,
          TINYRACK_UI_TARBALL: resolve(preparedDirectory, archive),
        },
      ) ?? 1;
  }
} finally {
  rmSync(preparedDirectory, { force: true, recursive: true });
}
