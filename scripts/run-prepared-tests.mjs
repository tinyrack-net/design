import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const workspaceRoot = resolve(import.meta.dirname, '..');
const preparedDirectory = mkdtempSync(resolve(tmpdir(), 'tinyrack-prepared-'));
const pnpmCli = process.env['npm_execpath'];

function runPnpm(args, env = process.env) {
  const command = pnpmCli
    ? process.execPath
    : process.platform === 'win32'
      ? 'pnpm.exe'
      : 'pnpm';
  const commandArgs = pnpmCli ? [pnpmCli, ...args] : args;

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
          TINYRACK_UI_TARBALL: resolve(preparedDirectory, archives[0]),
        },
      ) ?? 1;
  }
} finally {
  rmSync(preparedDirectory, { force: true, recursive: true });
}
