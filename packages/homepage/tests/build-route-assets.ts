import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const assetsRoot = join(process.cwd(), 'build/client/assets');

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function routeManifestSource() {
  const manifest = readdirSync(assetsRoot).find((file) =>
    /^manifest-.+\.js$/.test(file),
  );
  if (manifest === undefined)
    throw new Error('React Router asset manifest was not found.');
  return readFileSync(join(assetsRoot, manifest), 'utf8');
}

export function routeModulePath(routeId: string) {
  const match = new RegExp(
    `"${escapeRegex(routeId)}":\\{[^}]*?"module":"([^"]+)"`,
  ).exec(routeManifestSource());
  const modulePath = match?.[1];
  if (modulePath === undefined) {
    throw new Error(`Route module was not found in the asset manifest: ${routeId}`);
  }
  return modulePath;
}

export function routeModulePattern(routeId: string) {
  return new RegExp(`${escapeRegex(routeModulePath(routeId))}$`);
}
