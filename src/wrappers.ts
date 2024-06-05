import { ExecutorArgs, ExecutorExt, Reject, RejectArgs, Resolve, ResolveArgs, State } from "./types.ts";

export class Wrappers<T> {
  #state: State;
  #executor: ExecutorExt<T>;
  #resolve?: Resolve<T>;
  #reject?: Reject<T>;
  #resolveValues!: ResolveArgs<T>;
  #rejectValues!: RejectArgs<T>;

  static #executorEmpty<T>(..._args: ExecutorArgs<T>) {
    // Do nothing, this function is a placeholder for Promise constructor.
    // Keep it fully typed to match executor argument.
  }

  constructor(executor?: ExecutorExt<T>) {
    this.#state = State.Pending;
    this.#executor = executor ?? Wrappers.#executorEmpty;
  }

  /**
   * Wrapper for executor, bubbles `resolve` and `reject` to buffer variables.
   * Executing `tryResolve` and `tryReject` at the end in case `resolveWrapper` or `rejectWrapper` was called during executor work.
   * `resolveWrapper` or `rejectWrapper` being called during executor work is highly unlikely, but not impossible.
   */
  executorWrapper = (...args: ExecutorArgs<T>) => {
    this.#resolve = args[0];
    this.#reject = args[1];
    this.#executor(this.resolveWrapper, this.rejectWrapper, this.cancelWrapper);
    this.tryResolve();
    this.tryReject();
  };

  /**
   * Resolve guard, safe to call at any point.
   * Can be executed to resolve with values that were set before `resolve` was initialized.
   * Multiple calls allowed and are safe.
   */
  tryResolve = () => {
    if (this.#resolve && this.#state === State.Resolving) {
      this.#resolve(...this.#resolveValues);
      this.#state = State.Resolved;
    }
  };

  /**
   * Reject guard, safe to call at any point.
   * Can be executed to reject with values that were set before `reject` was initialized.
   * Multiple calls allowed and are safe.
   */
  tryReject = () => {
    if (this.#reject && this.#state === State.Rejecting) {
      this.#reject(...this.#rejectValues);
      this.#state = State.Rejected;
    }
  };

  /**
   * Resolve wrapper, meant to be used as actual resolve argument.
   * In case `resolve` was not yet initialized passed values are stored.
   * Any call but first (shared with rejectWrapper and cancelWrapper) will lead to warning in the console.
   */
  resolveWrapper = (...args: ResolveArgs<T>) => {
    if (this.#state === State.Pending) {
      this.#resolveValues = args;
      this.#state = State.Resolving;
      this.tryResolve();
    } else {
      console.warn(`Attempted to resolve ${this.#state} promise.`);
    }
  };

  /**
   * Reject wrapper, meant to be used as actual reject argument.
   * In case `reject` was not yet initialized passed values are stored.
   * Any call but first (shared with resolveWrapper and cancelWrapper) will lead to warning in the console.
   */
  rejectWrapper = (...args: RejectArgs<T>) => {
    if (this.#state === State.Pending) {
      this.#rejectValues = args;
      this.#state = State.Rejecting;
      this.tryReject();
    } else {
      console.warn(`Attempted to resolve ${this.#state} promise.`);
    }
  };

  /**
   * Cancel wrapper, meant to be used as actual cancel argument.
   * Any call but first (shared with resolveWrapper and rejectWrapper) will lead to warning in the console.
   */
  cancelWrapper = () => {
    if (this.#state === State.Pending) {
      this.#state = State.Canceled;
    } else {
      console.warn(`Attempted to cancel ${this.#state} promise.`);
    }
  };

  get state() {
    return this.#state;
  }
}
