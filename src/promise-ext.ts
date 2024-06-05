import { Wrappers } from "./wrappers.ts";
import { PromiseArgsExt, State } from "./types.ts";

export class PromiseExt<T> extends Promise<T> {
  #wrappers: Wrappers<T>;

  /**
   * Creates a promise that is resolved after the delay (ms).
   */
  static timeout = <T = void>(delay?: number, value?: T) => {
    return new Promise((resolve) => setTimeout(resolve, delay ?? 0, value));
  };

  // Since Promise constructor can delay (or do some weird magic looking like delay) executor,
  // we can run into situation when `resolve` and `reject` were not yet initialized,
  // because of that `resolveWrapper` and `rejectWrapper` implementation moved to closure.
  constructor(...args: Partial<PromiseArgsExt<T>>) {
    const [executor, ...rest] = args;
    const wrappers = new Wrappers(executor);
    super(wrappers.executorWrapper, ...rest);
    this.#wrappers = wrappers;
  }

  /**
   * State of the promise, possble values: pending, resolving, resolved, rejecting, rejected.
   */
  get state() {
    return this.#wrappers.state;
  }

  /**
   * Wrapper for executor's `resolve` function of the promise.
   * Can be used to resolve promise at any point without having that logic inside executor.
   */
  get resolve() {
    return this.#wrappers.resolveWrapper;
  }

  /**
   * Wrapper for executor's `reject` function of the promise.
   * Can be used to reject promise at any point without having that logic inside executor.
   */
  get reject() {
    return this.#wrappers.rejectWrapper;
  }

  /**
   * Wrapper for executor's `cancel` function of the promise.
   * Can be used to cancel promise at any point without having that logic inside executor.
   */
  get cancel() {
    return this.#wrappers.cancelWrapper;
  }

  get isPending() {
    return this.#wrappers.state === State.Pending;
  }

  get isResolving() {
    return this.#wrappers.state === State.Resolving;
  }

  get isResolved() {
    return this.#wrappers.state === State.Resolved;
  }

  get isRejecting() {
    return this.#wrappers.state === State.Rejecting;
  }

  get isRejected() {
    return this.#wrappers.state === State.Rejected;
  }

  get isCanceled() {
    return this.#wrappers.state === State.Canceled;
  }
}
