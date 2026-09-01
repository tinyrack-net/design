import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  crossPlatformParityFor,
  flutterPlatformOnlyComponents,
  reactComponentAdaptations,
  reactComponentParity,
  supportedFlutterComponentName,
} from './cross-platform-component-support.ts';
import { crossPlatformParityFixtures } from './cross-platform-parity-fixtures.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const componentsRoot = join(root, 'packages/ui_flutter/lib/src/components');
const reactComponentsRoot = join(root, 'packages/ui_web/src/components');
const packageEntrypoint = join(root, 'packages/ui_flutter/lib/tinyrack_ui.dart');

function dartFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return dartFiles(path);
    return entry.isFile() && entry.name.endsWith('.dart') ? [path] : [];
  });
}

function componentName(path: string) {
  const [component] = relative(componentsRoot, path).split(sep);
  assert.ok(component);
  return component;
}

test('every Flutter component has one named facade and no flat source file', () => {
  const entries = readdirSync(componentsRoot, { withFileTypes: true });
  const componentDirectories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  assert.equal(
    entries.some((entry) => entry.isFile() && entry.name.endsWith('.dart')),
    false,
  );
  assert.ok(componentDirectories.length > 0);

  for (const component of componentDirectories) {
    const files = readdirSync(join(componentsRoot, component));
    assert.ok(
      files.includes(`${component}.dart`),
      `${component} must expose ${component}.dart`,
    );
  }

  const entrypoint = readFileSync(packageEntrypoint, 'utf8');
  const exportedComponents = [
    ...entrypoint.matchAll(/^export 'src\/components\/([^/]+)\/([^/]+)\.dart';$/gmu),
  ]
    .map((match) => {
      assert.equal(match[1], match[2], `invalid component facade: ${match[0]}`);
      const component = match[1];
      assert.ok(component);
      return component;
    })
    .sort();

  assert.deepEqual(exportedComponents, componentDirectories);
});

test('cross-component imports use facades and remain acyclic', () => {
  const dependencies = new Map<string, Set<string>>();
  const files = dartFiles(componentsRoot);

  for (const file of files) {
    const owner = componentName(file);
    const ownerDependencies = dependencies.get(owner) ?? new Set<string>();
    dependencies.set(owner, ownerDependencies);
    const source = readFileSync(file, 'utf8');

    for (const match of source.matchAll(/^import '([^']+\.dart)';$/gmu)) {
      const importedPath = match[1];
      assert.ok(importedPath);
      const target = resolve(dirname(file), importedPath);
      const targetRelative = relative(componentsRoot, target);
      if (targetRelative.startsWith('..') || targetRelative === '') continue;

      const [targetComponent] = targetRelative.split(sep);
      assert.ok(targetComponent);
      if (targetComponent === owner) continue;

      assert.equal(
        target,
        join(componentsRoot, targetComponent, `${targetComponent}.dart`),
        `${relative(root, file)} bypasses the ${targetComponent} facade`,
      );
      ownerDependencies.add(targetComponent);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(component: string, path: readonly string[]) {
    if (visiting.has(component)) {
      assert.fail(`component import cycle: ${[...path, component].join(' -> ')}`);
    }
    if (visited.has(component)) return;
    visiting.add(component);
    for (const dependency of dependencies.get(component) ?? []) {
      visit(dependency, [...path, component]);
    }
    visiting.delete(component);
    visited.add(component);
  }

  for (const component of dependencies.keys()) visit(component, []);
});

test('every public component has an explicit cross-platform support classification', () => {
  const reactComponents = readdirSync(reactComponentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const flutterComponents = readdirSync(componentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const flutterInventory = new Set(flutterComponents);
  const missingFlutterPurpose = reactComponents.filter(
    (component) => !flutterInventory.has(supportedFlutterComponentName(component)),
  );

  assert.deepEqual(missingFlutterPurpose, []);

  const coveredFlutterComponents = new Set(
    reactComponents.map(supportedFlutterComponentName),
  );
  const unclassifiedFlutterComponents = flutterComponents.filter(
    (component) =>
      !coveredFlutterComponents.has(component) &&
      !(component in flutterPlatformOnlyComponents),
  );

  assert.deepEqual(unclassifiedFlutterComponents, []);

  for (const [reactComponent, adaptation] of Object.entries(
    reactComponentAdaptations,
  )) {
    assert.ok(
      reactComponents.includes(reactComponent),
      `stale React adaptation: ${reactComponent}`,
    );
    assert.ok(
      flutterInventory.has(adaptation.flutter),
      `${reactComponent} maps to missing Flutter component ${adaptation.flutter}`,
    );
    assert.ok(adaptation.reason.trim().length > 0);
  }

  for (const [flutterComponent, support] of Object.entries(
    flutterPlatformOnlyComponents,
  )) {
    assert.ok(
      flutterInventory.has(flutterComponent),
      `stale Flutter-only classification: ${flutterComponent}`,
    );
    assert.ok(support.reason.trim().length > 0);
  }
});

test('cross-platform support does not require one-to-one component APIs', () => {
  const flutterComponents = new Set(
    readdirSync(componentsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name),
  );

  assert.equal(supportedFlutterComponentName('input'), 'text_field');
  assert.equal(supportedFlutterComponentName('link-button'), 'button');
  assert.ok(flutterComponents.has('inline_suggestions'));
  assert.ok('inline_suggestions' in flutterPlatformOnlyComponents);
});

test('stronger cross-platform parity levels require executable fixtures', () => {
  const reactComponents = readdirSync(reactComponentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const component of reactComponents) {
    const support = crossPlatformParityFor(component);
    assert.ok(
      ['adapted', 'contract', 'geometry'].includes(support.level),
      `${component} has an invalid parity level`,
    );
    if (support.level === 'adapted') {
      assert.equal(support.fixture, undefined);
    } else {
      assert.ok(support.fixture, `${component} requires a parity fixture`);
      assert.ok(
        support.fixture in crossPlatformParityFixtures,
        `${component} references missing parity fixture ${support.fixture}`,
      );
      const fixture = crossPlatformParityFixtures[support.fixture];
      if (fixture === undefined) {
        assert.fail(`${component} references missing parity fixture`);
      }
      assert.equal(fixture.component, component);
      assert.equal(fixture.level, support.level);
      if (support.level === 'geometry') {
        assert.ok(fixture.geometry);
        assert.equal(fixture.geometry.tolerance, 0.5);
        assert.ok(fixture.geometry.compare.includes('parts'));
      }
    }
    assert.ok(support.rationale.trim().length > 0);
    assert.ok(support.sharedContract.length > 0);
    assert.ok(Array.isArray(support.excluded));
  }

  assert.deepEqual(Object.keys(reactComponentParity).sort(), reactComponents);
  assert.equal(Object.keys(reactComponentParity).length, 64);
  assert.equal(
    Object.values(reactComponentParity).filter(({ level }) => level === 'adapted')
      .length,
    8,
  );
  assert.equal(
    Object.values(reactComponentParity).filter(({ level }) => level === 'contract')
      .length,
    18,
  );
  assert.equal(
    Object.values(reactComponentParity).filter(({ level }) => level === 'geometry')
      .length,
    38,
  );
  assert.equal(Object.keys(crossPlatformParityFixtures).length, 56);
  assert.equal(crossPlatformParityFor('button').level, 'geometry');
  assert.equal(crossPlatformParityFor('alert').level, 'geometry');
  assert.equal(crossPlatformParityFor('app-shell').level, 'adapted');
  assert.throws(() => crossPlatformParityFor('missing-component'));
});
