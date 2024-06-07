import type { Resolve, Reject, Cancel, PromiseExecutor, Logger } from "./types.ts";
import { State } from "./enums.ts";

/**
 * Extended Promise class with additional functionality.
 */
export class PromiseExt<T> {
    #state: State;
    #inner: Promise<T>;
    #resolve?: Resolve<T>;
    #reject?: Reject;
    #data?: unknown;

    /**
     * Logger function for logging warnings. 
     * Set to `undefined` to suppress warnings.
     */
    static logger?: Logger = console.warn;

    /**
     * Creates a resolved `PromiseExt` instance.
     */
    static resolve<T>(...args: Parameters<Resolve<T>>) {
        const promise = new PromiseExt();
        promise.resolve(...args);
        return promise;
    }

    /**
     * Creates a rejected `PromiseExt` instance.
     */
    static reject(...args: Parameters<Reject>) {
        const promise = new PromiseExt();
        promise.reject(...args);
        return promise;
    }

    /**
     * Creates a canceled `PromiseExt` instance.
     */
    static cancel(...args: Parameters<Cancel>) {
        const promise = new PromiseExt();
        promise.cancel(...args);
        return promise;
    }

    /**
     * Creates a `PromiseExt` instance that resolves after a delay.
     */
    static timeout<T>(delay?: number, ...args: Parameters<Resolve<T>>) {
        return new PromiseExt((resolve) => setTimeout(resolve, delay, ...args));
    }

    constructor(executor?: PromiseExecutor<T>) {
        const executorWrapper = this.#getExecutorWrapper(executor);
        this.#state = State.Pending;
        this.#inner = new Promise(executorWrapper)
    }

    /**
     * Wraps the executor function to capture `resolve` and `reject` functions.
     * Passes custom `cancel` method as third argument to the executor.
     */
    #getExecutorWrapper(executor?: PromiseExecutor<T>) {
        return (resolve: Resolve<T>, reject: Reject) => {
            this.#resolve = resolve;
            this.#reject = reject;
            executor?.(this.resolve, this.reject, this.cancel);
        }
    }

    /**
     * Tries to resolve the promise if it's in the resolving state and `resolve` is captured.
     */
    #tryResolve() {
        if (this.#resolve && this.#state === State.Resolving) {
            this.#state = State.Resolved;
            this.#resolve(...this.#data as Parameters<Resolve<T>>);
        }
    }

    /**
     * Tries to reject the promise if it's in the rejecting state and `reject` is captured.
     */
    #tryReject() {
        if (this.#reject && this.#state === State.Rejecting) {
            this.#state = State.Rejected;
            this.#reject(...this.#data as Parameters<Reject>);
        }
    }

    /**
     * Resolves the promise as does the executor's `resolve` argument.
     * Can be used to resolve promise at any point without having that logic inside executor.
     */
    resolve = (...args: Parameters<Resolve<T>>) => {
        if (this.#state === State.Pending) {
            this.#state = State.Resolving;
            this.#data = args;
            this.#tryResolve();
        } else {
            PromiseExt.logger?.(`Attempted to resolve ${this.#state} promise.`);
        }
    }

    /**
     * Rejects the promise as does the executor's `reject` argument.
     * Can be used to reject promise at any point without having that logic inside executor.
     */
    reject = (...args: Parameters<Reject>) => {
        if (this.#state === State.Pending) {
            this.#state = State.Rejecting;
            this.#data = args;
            this.#tryReject();
        } else {
            PromiseExt.logger?.(`Attempted to reject ${this.#state} promise.`);
        }
    }

    /**
     * Cancels the promise as does the executor's `cancel` argument.
     * Can be used to cancel promise at any point without having that logic inside executor.
     */
    cancel = (...args: Parameters<Cancel>) => {
        if (this.#state === State.Pending) {
            this.#state = State.Canceled;
            this.#data = args;
        } else {
            PromiseExt.logger?.(`Attempted to cancel ${this.#state} promise.`);
        }
    }

    /**
     * Does the same as method `then` of the native `Promise`. 
     * Returns native `Promise` for better performance.
     */
    then = (...args: Parameters<Promise<T>["then"]>) => {
        return this.#inner.then(...args);
    }

    /**
     * Does the same as method `catch` of the native `Promise`. 
     * Returns native `Promise` for better performance.
     */
    catch = (...args: Parameters<Promise<T>["catch"]>) => {
        return this.#inner.catch(...args);
    }

    /**
     * Does the same as method `finally` of the native `Promise`. 
     * Returns native `Promise` for better performance.
     */
    finally = (...args: Parameters<Promise<T>["finally"]>) => {
        return this.#inner.finally(...args);
    }

    get state() {
        return this.#state;
    }

    get isPending() {
        return this.#state === State.Pending;
    }

    get isResolved() {
        return this.#state === State.Resolved;
    }

    get isRejected() {
        return this.#state === State.Rejected;
    }

    get isCanceled() {
        return this.#state === State.Canceled;
    }

}
