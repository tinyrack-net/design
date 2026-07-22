import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_START_PORT = 10_000;
const DEFAULT_END_PORT = 59_999;

type PortRange = {
  startPort?: number;
  endPort?: number;
};

function canonicalPath(path: string) {
  const absolutePath = resolve(path);

  try {
    return realpathSync.native(absolutePath);
  } catch {
    return absolutePath;
  }
}

export function parseWorktreePaths(output: string) {
  return output
    .split('\0')
    .filter((field) => field.startsWith('worktree '))
    .map((field) => field.slice('worktree '.length));
}

export function assignWorktreePorts(worktreePaths: string[], range: PortRange = {}) {
  const startPort = range.startPort ?? DEFAULT_START_PORT;
  const endPort = range.endPort ?? DEFAULT_END_PORT;
  const rangeSize = endPort - startPort + 1;
  const paths = [...new Set(worktreePaths.map(canonicalPath))].sort();

  if (!Number.isInteger(startPort) || !Number.isInteger(endPort) || rangeSize < 1) {
    throw new Error(`Invalid development port range: ${startPort}..${endPort}`);
  }
  if (paths.length > rangeSize) {
    throw new Error(
      `Cannot assign ${paths.length} worktrees to ${rangeSize} development ports`,
    );
  }

  const assignments = new Map<string, number>();
  const usedPorts = new Set<number>();

  for (const path of paths) {
    const initialOffset =
      createHash('sha256').update(path).digest().readUInt32BE(0) % rangeSize;
    let port = startPort + initialOffset;

    while (usedPorts.has(port)) {
      port = port === endPort ? startPort : port + 1;
    }

    assignments.set(path, port);
    usedPorts.add(port);
  }

  return assignments;
}

export function selectWorktreePort(
  currentWorktree: string,
  worktreePaths: string[],
  range: PortRange = {},
) {
  const currentPath = canonicalPath(currentWorktree);
  const paths =
    worktreePaths.length > 0 ? [...worktreePaths, currentPath] : [currentPath];
  const port = assignWorktreePorts(paths, range).get(currentPath);

  if (port === undefined) {
    throw new Error(`No development port was assigned to ${currentPath}`);
  }

  return port;
}

function hasExplicitPort(args: string[]) {
  return args.some(
    (argument) => argument === '--port' || argument.startsWith('--port='),
  );
}

export function buildDevCommandArgs(userArgs: string[], assignedPort: number) {
  const forwardedArgs = userArgs[0] === '--' ? userArgs.slice(1) : userArgs;
  const args = ['--filter', '@tinyrack/homepage', 'dev:app', ...forwardedArgs];

  if (!hasExplicitPort(forwardedArgs)) {
    args.push('--port', String(assignedPort));
  }

  return args;
}

function discoverWorktreePort(cwd: string) {
  let currentWorktree = canonicalPath(cwd);
  let worktreePaths: string[] = [];

  try {
    currentWorktree = execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    worktreePaths = parseWorktreePaths(
      execFileSync('git', ['worktree', 'list', '--porcelain', '-z'], {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }),
    );
  } catch {
    // Source archives and non-Git checkouts still get a stable path-based port.
  }

  return selectWorktreePort(currentWorktree, worktreePaths);
}

export function resolvePackageManagerCommand(
  npmExecPath: string | undefined,
  args: string[],
) {
  const nodeEntrypoint = npmExecPath && /\.(?:[cm]?js|ts)$/.test(npmExecPath);

  return {
    command: nodeEntrypoint ? process.execPath : (npmExecPath ?? 'pnpm'),
    commandArgs: nodeEntrypoint && npmExecPath ? [npmExecPath, ...args] : args,
  };
}

function run() {
  const userArgs = process.argv.slice(2);
  const assignedPort = hasExplicitPort(userArgs)
    ? 0
    : discoverWorktreePort(process.cwd());
  const args = buildDevCommandArgs(userArgs, assignedPort);
  const npmExecPath = process.env['npm_execpath'];
  const { command, commandArgs } = resolvePackageManagerCommand(npmExecPath, args);
  const result = spawnSync(command, commandArgs, { stdio: 'inherit' });

  if (result.error) {
    throw result.error;
  }
  if (result.signal) {
    process.kill(process.pid, result.signal);
    return;
  }

  process.exitCode = result.status ?? 1;
}

if (
  process.argv[1] &&
  canonicalPath(process.argv[1]) === canonicalPath(fileURLToPath(import.meta.url))
) {
  run();
}
