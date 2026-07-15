import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

export function restoreRedirectFiles(
  clientRoot: string,
  redirects: Readonly<Record<string, string>>,
) {
  const resolvedRoot = resolve(clientRoot);
  for (const [fileName, source] of Object.entries(redirects)) {
    const output = resolve(resolvedRoot, fileName);
    const relativeOutput = relative(resolvedRoot, output);
    if (
      isAbsolute(relativeOutput) ||
      relativeOutput === '..' ||
      relativeOutput.startsWith(`..${sep}`)
    ) {
      throw new Error(`Redirect output must stay inside the client build: ${fileName}`);
    }
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, source);
  }
}
