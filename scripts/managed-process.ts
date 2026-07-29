import { type ChildProcess, spawnSync } from 'node:child_process';

export function managedSpawnOptions(platform: NodeJS.Platform = process.platform) {
  return { detached: platform !== 'win32' };
}

export function processTreeTermination(
  pid: number,
  platform: NodeJS.Platform = process.platform,
) {
  return platform === 'win32'
    ? {
        args: ['/pid', String(pid), '/t', '/f'],
        command: 'taskkill.exe',
      }
    : {
        pid: -pid,
        signal: 'SIGTERM' as const,
      };
}

export function terminateProcessTree(
  child: ChildProcess,
  platform: NodeJS.Platform = process.platform,
) {
  if (child.pid === undefined || child.exitCode !== null) return;
  const termination = processTreeTermination(child.pid, platform);
  if ('command' in termination) {
    const result = spawnSync(termination.command, termination.args, {
      stdio: 'ignore',
      windowsHide: true,
    });
    if (result.error !== undefined || result.status !== 0) child.kill();
    return;
  }
  try {
    process.kill(termination.pid, termination.signal);
  } catch {
    child.kill();
  }
}
