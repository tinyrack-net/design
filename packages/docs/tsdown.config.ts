import { readdirSync } from 'node:fs';
import { defineConfig } from 'tsdown';

const entry = [
  // Public surface: every `package.json` export maps 1:1 to a file here.
  'src/entrypoints/**/*.ts',
  // Internal highlighting modules resolved by the Vite highlighter plugin at
  // runtime through their built dist path, so they need a stable dist location
  // even though no public entrypoint statically imports them.
  'src/highlighting/docs-highlighter.ts',
  'src/highlighting/docs-languages.ts',
] as const;

// Every co-located component stylesheet is copied into a mirrored dist folder so
// the published styles.css @import graph (which points at ../components/<name>/…)
// resolves. Discovered from the filesystem so adding a component's CSS needs no
// build-config edit; a per-directory copy preserves the nested structure that a
// flat glob would collapse.
const componentStyles = readdirSync('src/components', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((dir) =>
    readdirSync(`src/components/${dir.name}`).some((file) => file.endsWith('.css')),
  )
  .map((dir) => ({
    from: `src/components/${dir.name}/*.css`,
    to: `dist/components/${dir.name}`,
  }));

const copy = [
  { from: 'src/styles/styles.css', to: 'dist/styles' },
  ...componentStyles,
] as const;

export default defineConfig({
  entry,
  format: 'esm',
  dts: { sourcemap: true },
  clean: true,
  fixedExtension: false,
  platform: 'neutral',
  unbundle: true,
  treeshake: true,
  sourcemap: true,
  tsconfig: './tsconfig.build.json',
  copy: [...copy],
  onSuccess: 'tsc -p tsconfig.test.json --noEmit',
});
