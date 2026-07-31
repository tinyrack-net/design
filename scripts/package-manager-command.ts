type PackageManagerCommandOptions = {
  nodePath?: string;
  npmExecPath?: string | null;
  platform?: NodeJS.Platform;
};

export function packageManagerCommand(
  args: readonly string[],
  {
    nodePath = process.execPath,
    npmExecPath = process.env['npm_execpath'],
    platform = process.platform,
  }: PackageManagerCommandOptions = {},
) {
  if (npmExecPath && /\.(?:[cm]?js|ts)$/.test(npmExecPath)) {
    return {
      args: [npmExecPath, ...args],
      command: nodePath,
    };
  }

  return {
    args: [...args],
    command: npmExecPath ?? (platform === 'win32' ? 'pnpm.exe' : 'pnpm'),
  };
}
