import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';

const pnpm = process.platform === 'win32' ? 'pnpm.exe' : 'pnpm';
const result = spawnSync(pnpm, ['exec', 'react-router', 'build'], {
  cwd: process.cwd(),
  encoding: 'utf8',
  env: { ...process.env, FORCE_COLOR: '0' },
});

process.stdout.write(result.stdout ?? '');
process.stderr.write(result.stderr ?? '');

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
const warningLines = output
  .split(/\r?\n/)
  .filter((line) => /\bwarn(?:ing)?\b|deprecated|\[PLUGIN_TIMINGS\]/i.test(line));

if (warningLines.length > 0) {
  throw new Error(
    `React Router production build emitted warnings:\n${warningLines.join('\n')}`,
  );
}

rmSync(join(process.cwd(), 'build/client/__spa-fallback.html'), { force: true });
