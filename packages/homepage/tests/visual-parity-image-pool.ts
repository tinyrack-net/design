import { Worker } from 'node:worker_threads';
import type { ComparisonOptions, ImageComparison } from './visual-parity-image.ts';

type Work = {
  flutter: Uint8Array<ArrayBuffer>;
  height: number;
  options: ComparisonOptions;
  react: Uint8Array<ArrayBuffer>;
  reject: (error: unknown) => void;
  resolve: (result: ImageComparison) => void;
  width: number;
};

type WorkerState = {
  current: Work | undefined;
  worker: Worker;
};

export class VisualParityImagePool {
  readonly #queue: Work[] = [];
  readonly #states: WorkerState[];
  #closed = false;
  #nextId = 0;

  constructor(size: number) {
    if (!Number.isInteger(size) || size < 1) {
      throw new RangeError('Image pool size must be a positive integer.');
    }
    this.#states = Array.from({ length: size }, () => this.#createState());
  }

  compare(
    react: Uint8Array,
    flutter: Uint8Array,
    width: number,
    height: number,
    options: ComparisonOptions = {},
  ) {
    if (this.#closed) {
      return Promise.reject(new Error('Visual parity image pool is closed.'));
    }
    return new Promise<ImageComparison>((resolve, reject) => {
      this.#queue.push({
        flutter: Uint8Array.from(flutter),
        height,
        options,
        react: Uint8Array.from(react),
        reject,
        resolve,
        width,
      });
      this.#dispatch();
    });
  }

  async close() {
    if (this.#closed) return;
    this.#closed = true;
    const error = new Error('Visual parity image pool is closed.');
    for (const work of this.#queue.splice(0)) work.reject(error);
    for (const state of this.#states) state.current?.reject(error);
    await Promise.allSettled(this.#states.map((state) => state.worker.terminate()));
  }

  #createState(): WorkerState {
    const state: WorkerState = {
      current: undefined,
      worker: undefined as unknown as Worker,
    };
    state.worker = this.#createWorker(state);
    return state;
  }

  #createWorker(state: WorkerState) {
    const worker = new Worker(
      new URL('./visual-parity-image.worker.ts', import.meta.url),
    );
    worker.on(
      'message',
      (message: {
        id: number;
        result: Omit<ImageComparison, 'diff'> & { diff: Uint8Array };
      }) => {
        if (state.worker !== worker) return;
        const work = state.current;
        state.current = undefined;
        work?.resolve({ ...message.result, diff: Buffer.from(message.result.diff) });
        this.#dispatch();
      },
    );
    worker.on('error', (error) => {
      this.#replaceWorker(state, worker, error);
    });
    worker.on('exit', (code) => {
      if (!this.#closed && code !== 0) {
        this.#replaceWorker(
          state,
          worker,
          new Error(`Visual parity image worker exited with code ${code}.`),
        );
      }
    });
    return worker;
  }

  #replaceWorker(state: WorkerState, failedWorker: Worker, error: unknown) {
    if (state.worker !== failedWorker) return;
    state.current?.reject(error);
    state.current = undefined;
    if (!this.#closed) state.worker = this.#createWorker(state);
    this.#dispatch();
  }

  #dispatch() {
    if (this.#closed) return;
    for (const state of this.#states) {
      if (state.current !== undefined) continue;
      const work = this.#queue.shift();
      if (work === undefined) return;
      state.current = work;
      const id = ++this.#nextId;
      try {
        state.worker.postMessage(
          {
            flutter: work.flutter.buffer,
            height: work.height,
            id,
            options: work.options,
            react: work.react.buffer,
            width: work.width,
          },
          [work.react.buffer, work.flutter.buffer],
        );
      } catch (error) {
        this.#replaceWorker(state, state.worker, error);
      }
    }
  }
}
