import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  collectFlutterPreviewAssets,
  createFlutterPreviewProxy,
  flutterDwdsHandlerPath,
} from '../scripts/flutter-preview-plugin.ts';

describe('Flutter preview development proxy', () => {
  it('routes preview assets and the DWDS WebSocket to the same server', () => {
    const target = 'http://127.0.0.1:57933';
    const proxy = createFlutterPreviewProxy(target);

    expect(proxy['/flutter-preview']).toMatchObject({ target });
    expect(proxy['/flutter-preview'].rewrite('/flutter-preview/main.dart.js')).toBe(
      '/main.dart.js',
    );
    expect(proxy['/flutter-preview'].rewrite('/flutter-preview')).toBe('/');
    expect(proxy[flutterDwdsHandlerPath]).toEqual({
      target,
      ws: true,
    });
  });

  it('collects staged release assets and fails clearly when staging is missing', async () => {
    const root = mkdtempSync(join(tmpdir(), 'tinyrack-flutter-preview-'));
    try {
      mkdirSync(join(root, 'assets'), { recursive: true });
      writeFileSync(join(root, 'index.html'), '<!doctype html>');
      writeFileSync(join(root, 'assets', 'FontManifest.json'), '{}');

      await expect(collectFlutterPreviewAssets(root)).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fileName: 'flutter-preview/assets/FontManifest.json',
          }),
          expect.objectContaining({ fileName: 'flutter-preview/index.html' }),
        ]),
      );
      await expect(collectFlutterPreviewAssets(join(root, 'missing'))).rejects.toThrow(
        'Flutter preview staging output is missing',
      );
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });
});
