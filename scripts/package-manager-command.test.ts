import assert from 'node:assert/strict';
import test from 'node:test';
import { packageManagerCommand } from './package-manager-command.ts';

test('runs a Windows package manager executable directly', () => {
  assert.deepEqual(
    packageManagerCommand(['test'], {
      nodePath: 'C:\\Program Files\\nodejs\\node.exe',
      npmExecPath: 'C:\\pnpm\\pnpm.exe',
      platform: 'win32',
    }),
    {
      args: ['test'],
      command: 'C:\\pnpm\\pnpm.exe',
    },
  );
});

test('runs a JavaScript package manager CLI through Node.js', () => {
  assert.deepEqual(
    packageManagerCommand(['test'], {
      nodePath: '/usr/bin/node',
      npmExecPath: '/pnpm/pnpm.cjs',
      platform: 'linux',
    }),
    {
      args: ['/pnpm/pnpm.cjs', 'test'],
      command: '/usr/bin/node',
    },
  );
});

test('uses the platform package manager fallback', () => {
  assert.equal(
    packageManagerCommand([], {
      npmExecPath: null,
      platform: 'win32',
    }).command,
    'pnpm.exe',
  );
  assert.equal(
    packageManagerCommand([], {
      npmExecPath: null,
      platform: 'linux',
    }).command,
    'pnpm',
  );
});
