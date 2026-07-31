import { describe, expect, it } from 'vitest';
import {
  managedSpawnOptions,
  processTreeTermination,
} from '../../../scripts/managed-process.ts';

describe('managed development processes', () => {
  it('creates a process group and terminates the whole tree on each platform', () => {
    expect(managedSpawnOptions('linux')).toEqual({ detached: true });
    expect(processTreeTermination(4321, 'linux')).toEqual({
      pid: -4321,
      signal: 'SIGTERM',
    });
    expect(managedSpawnOptions('win32')).toEqual({ detached: false });
    expect(processTreeTermination(4321, 'win32')).toEqual({
      args: ['/pid', '4321', '/t', '/f'],
      command: 'taskkill.exe',
    });
  });
});
