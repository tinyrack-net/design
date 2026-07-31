import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const exampleRoot = resolve(root, 'packages/tinyrack_ui/example');

const flutterArgs = [
  'build',
  'web',
  '--release',
  '--base-href',
  '/flutter-preview/',
  '--no-web-resources-cdn',
  '--no-wasm-dry-run',
];
const result =
  process.platform === 'win32'
    ? spawnSync(
        process.env['ComSpec'] ?? 'C:\\Windows\\System32\\cmd.exe',
        ['/d', '/s', '/c', 'flutter', ...flutterArgs],
        { cwd: exampleRoot, stdio: 'inherit' },
      )
    : spawnSync('flutter', flutterArgs, { cwd: exampleRoot, stdio: 'inherit' });

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
