import { spawn } from 'node:child_process';
import net from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { managedSpawnOptions, terminateProcessTree } from './managed-process.ts';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const flutterExample = resolve(workspaceRoot, 'packages/tinyrack_ui/example');
const flutterArgs = (port: number) => [
  'run',
  '-d',
  'web-server',
  '--web-hostname',
  '127.0.0.1',
  '--web-port',
  String(port),
];

function availablePort() {
  return new Promise<number>((resolvePort, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (typeof address !== 'object' || address === null) {
        reject(new Error('Could not reserve a Flutter preview port.'));
        return;
      }
      server.close(() => resolvePort(address.port));
    });
  });
}

const previewPort = await availablePort();
const environment = {
  ...process.env,
  TINYRACK_FLUTTER_PREVIEW_ORIGIN: `http://127.0.0.1:${previewPort}`,
};
const flutter =
  process.platform === 'win32'
    ? spawn(
        process.env['ComSpec'] ?? 'C:\\Windows\\System32\\cmd.exe',
        ['/d', '/s', '/c', 'flutter', ...flutterArgs(previewPort)],
        {
          ...managedSpawnOptions(),
          cwd: flutterExample,
          env: environment,
          stdio: 'inherit',
        },
      )
    : spawn('flutter', flutterArgs(previewPort), {
        ...managedSpawnOptions(),
        cwd: flutterExample,
        env: environment,
        stdio: 'inherit',
      });
const npmExecPath = process.env['npm_execpath'];
const packageManager =
  npmExecPath && /\.(?:[cm]?js|ts)$/.test(npmExecPath)
    ? process.execPath
    : (npmExecPath ?? 'pnpm');
const packageManagerArgs =
  packageManager === process.execPath && npmExecPath ? [npmExecPath] : [];
const homepage = spawn(
  packageManager,
  [
    ...packageManagerArgs,
    '--filter',
    '@tinyrack/homepage',
    'dev',
    ...process.argv.slice(2),
  ],
  {
    ...managedSpawnOptions(),
    cwd: workspaceRoot,
    env: environment,
    stdio: 'inherit',
  },
);

let exiting = false;
function stop(exitCode = 0) {
  if (exiting) return;
  exiting = true;
  terminateProcessTree(flutter);
  terminateProcessTree(homepage);
  process.exitCode = exitCode;
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => stop());
}
flutter.on('error', (error) => {
  console.error(error);
  stop(1);
});
homepage.on('error', (error) => {
  console.error(error);
  stop(1);
});
flutter.on('exit', (code, signal) => {
  if (!exiting) {
    console.error(
      signal
        ? `Flutter preview stopped with ${signal}.`
        : `Flutter preview stopped with exit code ${code ?? 1}.`,
    );
    stop(code ?? 1);
  }
});
homepage.on('exit', (code) => stop(code ?? 1));
