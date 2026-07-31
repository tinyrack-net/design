import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';

const repetitions = 3;
const budgetMs = 180_000;
const results: Record<string, number[]> = {};
const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

for (const mode of ['endpoint', 'motion'] as const) {
  const durations: number[] = [];
  for (let run = 1; run <= repetitions; run += 1) {
    const startedAt = performance.now();
    const exitCode = await new Promise<number | null>((resolve, reject) => {
      const child = spawn(command, [`test:visual-parity:${mode}`], {
        env: {
          ...process.env,
          TINYRACK_VISUAL_PARITY_PROFILE: '1',
        },
        stdio: 'inherit',
      });
      child.once('error', reject);
      child.once('exit', resolve);
    });
    if (exitCode !== 0) {
      throw new Error(`${mode} benchmark run ${run} exited with ${exitCode}.`);
    }
    durations.push(performance.now() - startedAt);
  }
  results[mode] = durations;
}

const medians = Object.fromEntries(
  Object.entries(results).map(([mode, durations]) => {
    const sorted = [...durations].sort((left, right) => left - right);
    return [mode, sorted[Math.floor(sorted.length / 2)]];
  }),
);
const report = {
  budgetMs,
  medians,
  repetitions,
  results,
};
const reportPath = join(process.cwd(), 'test-results/visual-parity/benchmark.json');
await mkdir(join(process.cwd(), 'test-results/visual-parity'), {
  recursive: true,
});
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.info(JSON.stringify(report, null, 2));

for (const [mode, median] of Object.entries(medians)) {
  if (median !== undefined && median > budgetMs) {
    throw new Error(`${mode} median ${median.toFixed(0)}ms exceeds ${budgetMs}ms.`);
  }
}
