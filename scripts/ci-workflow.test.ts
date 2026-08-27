import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';

const repositoryRoot = resolve(import.meta.dirname, '..');
const ci = readFileSync(resolve(repositoryRoot, '.github/workflows/ci.yml'), 'utf8');
const deployment = readFileSync(
  resolve(repositoryRoot, '.github/workflows/deploy-homepage.yml'),
  'utf8',
);

function job(definition: string, name: string, next?: string) {
  const start = definition.indexOf(`  ${name}:\n`);
  assert.notEqual(start, -1, `Missing ${name} job`);
  const end =
    next === undefined ? definition.length : definition.indexOf(`  ${next}:\n`, start);
  assert.notEqual(end, -1, `Missing ${next} job after ${name}`);
  return definition.slice(start, end);
}

describe('CI event lanes', () => {
  it('keeps main pushes out of the verification workflow', () => {
    const triggers = ci.slice(0, ci.indexOf('\npermissions:'));
    assert.match(triggers, /pull_request:/);
    assert.match(triggers, /merge_group:/);
    assert.doesNotMatch(triggers, /push:/);
  });

  it('runs detailed browser and Flutter checks only in the merge queue', () => {
    assert.match(
      job(ci, 'ui_firefox', 'ui_webkit'),
      /github\.event_name == 'merge_group'/,
    );
    assert.match(
      job(ci, 'ui_webkit', 'docs_contract'),
      /github\.event_name == 'merge_group'/,
    );
    const platforms = job(ci, 'flutter_platforms', 'flutter_linux');
    assert.match(platforms, /github\.event_name == 'merge_group'/);
    for (const target of ['android', 'linux', 'ios', 'macos', 'windows']) {
      assert.match(platforms, new RegExp(`target: ${target}`));
    }
    assert.match(
      job(ci, 'flutter_preview', 'ci_gate'),
      /github\.event_name == 'merge_group'/,
    );
    const parity = job(ci, 'cross_platform_parity', 'flutter');
    assert.match(parity, /needs\.changes\.outputs\.parity == 'true'/);
    assert.match(parity, /test:parity/);
  });

  it('keeps the pull-request Flutter build on Linux', () => {
    const linux = job(ci, 'flutter_linux', 'flutter_preview');
    assert.match(linux, /github\.event_name == 'pull_request'/);
    assert.match(linux, /runs-on: ubuntu-latest/);
    assert.match(linux, /flutter build linux --debug/);
  });

  it('requires every selected or completed job at the stable gate', () => {
    const gate = job(ci, 'ci_gate');
    assert.match(gate, /name: CI gate/);
    assert.match(gate, /QUALITY_RESULTS: \$\{\{ toJSON\(needs\) \}\}/);
    assert.match(gate, /\.result == "success" or \.result == "skipped"/);
    assert.match(gate, /\.changes\.result == "success"/);
    assert.match(gate, /- quality_linux/);
    assert.match(gate, /- flutter_linux/);
    assert.match(gate, /- cross_platform_parity/);
  });
});

describe('Homepage deployment workflow', () => {
  it('builds from main without re-running the CI test suites', () => {
    const triggers = deployment.slice(0, deployment.indexOf('\npermissions:'));
    assert.match(triggers, /push:/);
    assert.match(triggers, /- main/);
    assert.match(deployment, /cancel-in-progress: true/);
    assert.match(deployment, /ci-change-plan\.ts --base/);
    assert.match(deployment, /pnpm --filter @tinyrack\/homepage build/);
    assert.match(deployment, /pnpm run docs:deploy/);
    assert.doesNotMatch(deployment, /test:ci-|test:prepared|test:flutter-dev/);
  });
});
