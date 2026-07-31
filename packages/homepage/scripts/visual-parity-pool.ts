type Waiter<T, K> = {
  key: K;
  reject: (error: unknown) => void;
  resolve: (resource: T) => void;
};

export class VisualParityPool<T, K = undefined> {
  readonly #create: (key: K) => Promise<T>;
  readonly #destroy: (resource: T) => Promise<void>;
  readonly #idle: T[] = [];
  readonly #maximumSize: number;
  readonly #matches: (resource: T, key: K) => boolean;
  readonly #waiters: Waiter<T, K>[] = [];
  #closed = false;
  #size = 0;

  constructor(options: {
    create: (key: K) => Promise<T>;
    destroy: (resource: T) => Promise<void>;
    maximumSize: number;
    matches?: (resource: T, key: K) => boolean;
  }) {
    if (!Number.isInteger(options.maximumSize) || options.maximumSize < 1) {
      throw new RangeError('maximumSize must be a positive integer.');
    }
    this.#create = options.create;
    this.#destroy = options.destroy;
    this.#maximumSize = options.maximumSize;
    this.#matches = options.matches ?? (() => true);
  }

  get size() {
    return this.#size;
  }

  async acquire(key: K): Promise<T> {
    if (this.#closed) throw new Error('Visual parity pool is closed.');
    const idleIndex = this.#idle.findIndex((resource) => this.#matches(resource, key));
    if (idleIndex >= 0) {
      const [idle] = this.#idle.splice(idleIndex, 1);
      if (idle !== undefined) return idle;
    }
    if (this.#size < this.#maximumSize) {
      this.#size += 1;
      try {
        return await this.#create(key);
      } catch (error) {
        this.#size -= 1;
        this.#pump();
        throw error;
      }
    }
    const replace = this.#idle.pop();
    if (replace !== undefined) {
      await this.#destroy(replace);
      this.#size -= 1;
      return this.acquire(key);
    }
    return new Promise<T>((resolve, reject) => {
      this.#waiters.push({ key, reject, resolve });
    });
  }

  async release(resource: T, { discard = false } = {}) {
    if (this.#closed || discard) {
      await this.#destroy(resource);
      this.#size -= 1;
      this.#pump();
      return;
    }
    const waiterIndex = this.#waiters.findIndex((waiter) =>
      this.#matches(resource, waiter.key),
    );
    const [waiter] = waiterIndex >= 0 ? this.#waiters.splice(waiterIndex, 1) : [];
    if (waiter === undefined) {
      this.#idle.push(resource);
      this.#pump();
    } else {
      waiter.resolve(resource);
    }
  }

  async close() {
    if (this.#closed) return;
    this.#closed = true;
    const error = new Error('Visual parity pool is closed.');
    for (const waiter of this.#waiters.splice(0)) waiter.reject(error);
    const idle = this.#idle.splice(0);
    await Promise.allSettled(idle.map((resource) => this.#destroy(resource)));
    this.#size -= idle.length;
  }

  #pump() {
    if (this.#closed) return;
    const waiter = this.#waiters.shift();
    if (waiter === undefined) return;
    const idleIndex = this.#idle.findIndex((resource) =>
      this.#matches(resource, waiter.key),
    );
    if (idleIndex >= 0) {
      const [resource] = this.#idle.splice(idleIndex, 1);
      if (resource !== undefined) waiter.resolve(resource);
      return;
    }
    if (this.#size >= this.#maximumSize) {
      const replace = this.#idle.pop();
      if (replace === undefined) {
        this.#waiters.unshift(waiter);
        return;
      }
      this.#destroy(replace).then(() => {
        this.#size -= 1;
        this.#waiters.unshift(waiter);
        this.#pump();
      }, waiter.reject);
      return;
    }
    this.#size += 1;
    this.#create(waiter.key).then(waiter.resolve, (error) => {
      this.#size -= 1;
      waiter.reject(error);
      this.#pump();
    });
  }
}
