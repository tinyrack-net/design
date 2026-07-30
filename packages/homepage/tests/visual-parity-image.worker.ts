import { parentPort } from 'node:worker_threads';
import { type ComparisonOptions, compareParityImages } from './visual-parity-image.ts';

if (parentPort === null) throw new Error('Visual parity image worker has no parent.');
const port = parentPort;

port.on(
  'message',
  (message: {
    flutter: ArrayBuffer;
    height: number;
    id: number;
    options: ComparisonOptions;
    react: ArrayBuffer;
    width: number;
  }) => {
    const result = compareParityImages(
      new Uint8Array(message.react),
      new Uint8Array(message.flutter),
      message.width,
      message.height,
      message.options,
    );
    port.postMessage({
      id: message.id,
      result: { ...result, diff: Uint8Array.from(result.diff) },
    });
  },
);
