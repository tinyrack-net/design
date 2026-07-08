import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { tinyrackComponentParityContracts } from './component-parity.js';

const repoRoot = process.cwd();

function storyPath(library: 'daisyui' | 'mantine', component: string) {
  return join(
    repoRoot,
    'stories',
    library,
    'components',
    `${component.toLowerCase()}.stories.tsx`,
  );
}

function hasSharedStoryContract(component: string) {
  return Object.values(tinyrackComponentParityContracts).some(
    (contract) =>
      contract.daisyUi.some((item) => item.toLowerCase() === component) &&
      contract.mantine.some((item) => item.toLowerCase() === component),
  );
}

const exactSharedStoryComponents = [
  'alert',
  'avatar',
  'badge',
  'breadcrumbs',
  'button',
  'card',
  'checkbox',
  'collapse',
  'divider',
  'drawer',
  'fieldset',
  'fileinput',
  'indicator',
  'input',
  'kbd',
  'list',
  'menu',
  'modal',
  'progress',
  'radio',
  'rating',
  'select',
  'skeleton',
  'stack',
  'table',
  'textarea',
  'timeline',
  'tooltip',
] as const;

describe('Tinyrack component parity contracts', () => {
  it('tracks every cross-library component against existing Storybook coverage', () => {
    for (const [contractName, contract] of Object.entries(
      tinyrackComponentParityContracts,
    )) {
      expect(
        contract.axes.length,
        `${contractName} should define visual axes`,
      ).toBeGreaterThan(0);

      for (const component of contract.daisyUi) {
        expect(
          existsSync(storyPath('daisyui', component)),
          `${contractName} points to missing daisyUI story ${component}`,
        ).toBe(true);
      }

      for (const component of contract.mantine) {
        expect(
          existsSync(storyPath('mantine', component)),
          `${contractName} points to missing Mantine story ${component}`,
        ).toBe(true);
      }
    }
  });

  it('covers every exact same-name component story shared by Mantine and daisyUI', () => {
    for (const component of exactSharedStoryComponents) {
      expect(
        hasSharedStoryContract(component),
        `${component} should be represented in Tinyrack component parity contracts`,
      ).toBe(true);
    }
  });

  it('resolves every tracked parity contract', () => {
    for (const [contractName, contract] of Object.entries(
      tinyrackComponentParityContracts,
    )) {
      expect(contract.status, `${contractName} should not be left unmapped`).not.toBe(
        'needs-mapping',
      );
    }
  });

  it('marks Button as the first mapped parity slice', () => {
    expect(tinyrackComponentParityContracts.button).toMatchObject({
      axes: expect.arrayContaining([
        'color',
        'focus',
        'radius',
        'size',
        'state',
        'typography',
      ]),
      daisyUi: ['button'],
      mantine: ['Button'],
      status: 'mapped',
    });
  });

  it('tracks form controls that share the Tinyrack control contract', () => {
    for (const contractName of ['fileInput', 'input', 'select', 'textarea'] as const) {
      expect(tinyrackComponentParityContracts[contractName].status).toBe('mapped');
      expect(tinyrackComponentParityContracts[contractName].axes).toEqual(
        expect.arrayContaining([
          'color',
          'focus',
          'radius',
          'size',
          'state',
          'typography',
        ]),
      );
    }
  });

  it('tracks compact display components that share mapped size contracts', () => {
    for (const contractName of ['badge', 'kbd'] as const) {
      expect(tinyrackComponentParityContracts[contractName].status).toBe('mapped');
      expect(tinyrackComponentParityContracts[contractName].axes).toEqual(
        expect.arrayContaining(['color', 'radius', 'size', 'typography']),
      );
    }
  });

  it('tracks selection controls that share mapped size and state contracts', () => {
    for (const contractName of ['checkbox', 'radio', 'switch'] as const) {
      expect(tinyrackComponentParityContracts[contractName].status).toBe('mapped');
      expect(tinyrackComponentParityContracts[contractName].axes).toEqual(
        expect.arrayContaining(['color', 'focus', 'radius', 'size', 'state']),
      );
    }
  });

  it('tracks surface and feedback components that share mapped visual contracts', () => {
    for (const contractName of [
      'alert',
      'card',
      'divider',
      'fieldset',
      'progress',
      'skeleton',
    ] as const) {
      expect(tinyrackComponentParityContracts[contractName].status).toBe('mapped');
      expect(tinyrackComponentParityContracts[contractName].axes).toEqual(
        expect.arrayContaining(['color']),
      );
    }
  });

  it('tracks visual status components that share mapped size and color contracts', () => {
    for (const contractName of [
      'avatar',
      'indicator',
      'loader',
      'radialProgress',
      'rating',
    ] as const) {
      expect(tinyrackComponentParityContracts[contractName].status).toBe('mapped');
      expect(tinyrackComponentParityContracts[contractName].axes).toEqual(
        expect.arrayContaining(['color', 'size']),
      );
    }
  });

  it('tracks navigation and data-display components that share mapped visual contracts', () => {
    for (const contractName of [
      'breadcrumbs',
      'list',
      'range',
      'stepper',
      'table',
      'tabs',
      'timeline',
    ] as const) {
      expect(tinyrackComponentParityContracts[contractName].status).toBe('mapped');
      expect(tinyrackComponentParityContracts[contractName].axes).toEqual(
        expect.arrayContaining(['color']),
      );
    }
  });

  it('tracks overlay components that share mapped surface contracts', () => {
    for (const contractName of ['drawer', 'menu', 'modal', 'tooltip'] as const) {
      expect(tinyrackComponentParityContracts[contractName].status).toBe('mapped');
      expect(tinyrackComponentParityContracts[contractName].axes).toEqual(
        expect.arrayContaining(['color', 'radius', 'shadow', 'state']),
      );
    }
  });

  it('documents same-name components that are not safe to force into visual parity', () => {
    for (const contractName of ['collapse', 'stack'] as const) {
      expect(tinyrackComponentParityContracts[contractName].status).toBe('contracted');
      expect(tinyrackComponentParityContracts[contractName].reason).toEqual(
        expect.any(String),
      );
    }
  });
});
