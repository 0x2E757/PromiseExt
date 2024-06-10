import type { Resolve, Reject, Cancel, PromiseExecutor, Logger } from "./types.ts";
import { State } from "./enums.ts";

/**
 * Extended Promise class with additional functionality.
 */
export class PromiseExt<T> {
    #state: State;
    #inner: Promise<T>;
    #resolve: Resolve<T>;
    #reject: Reject;

    /**
     * Logger function for logging warnings. 
     * Set to `undefined` to suppress warnings.
     */
    static logger?: Logger = console.warn;

    /**
     * Creates a resolved `PromiseExt` instance.
     */
    static resolve<T>(...args: Parameters<Resolve<T>>) {
        const promise = new PromiseExt<T>();
        promise.resolve(...args);
        return promise;
    }

    /**
     * Creates a rejected `PromiseExt` instance.
     */
    static reject<T = never>(...args: Parameters<Reject>) {
        const promise = new PromiseExt<T>();
        promise.reject(...args);
        return promise;
    }

    /**
     * Creates a canceled `PromiseExt` instance.
     */
    static cancel<T = never>(...args: Parameters<Cancel>) {
        const promise = new PromiseExt<T>();
        promise.cancel(...args);
        return promise;
    }

    /**
     * Creates a `PromiseExt` instance that resolves after a delay.
     */
    static timeout<T = never>(delay?: number, ...args: Partial<Parameters<Resolve<T>>>) {
        const promise = new PromiseExt<T>();
        setTimeout(promise.resolve, delay, ...args);
        return promise;
    }

    /**
     * Same as `Promise.all` but returns a `PromiseExt` instance.
     */
    static all<T extends unknown[]>(...args: Parameters<typeof Promise.all<T>>) {
        type TResult = ReturnType<typeof Promise.all<T>> extends PromiseLike<infer U> ? U : unknown;
        return PromiseExt.resolve<TResult>(Promise.all(...args));
    }

    /**
     * Same as `Promise.allSettled` but returns a `PromiseExt` instance.
     */
    static allSettled<T extends unknown[]>(...args: Parameters<typeof Promise.allSettled<T>>) {
        type TResult = ReturnType<typeof Promise.allSettled<T>> extends PromiseLike<infer U> ? U : unknown;
        return PromiseExt.resolve<TResult>(Promise.allSettled(...args));
    }

    /**
     * Same as `Promise.any` but returns a `PromiseExt` instance.
     */
    static any<T extends unknown[]>(...args: Parameters<typeof Promise.any<T>>) {
        type TResult = ReturnType<typeof Promise.any<T>> extends PromiseLike<infer U> ? U : unknown;
        return PromiseExt.resolve<TResult>(Promise.any(...args));
    }

    /**
     * Same as `Promise.race` but returns a `PromiseExt` instance.
     */
    static race<T extends unknown[]>(...args: Parameters<typeof Promise.race<T>>) {
        type TResult = ReturnType<typeof Promise.race<T>> extends PromiseLike<infer U> ? U : unknown;
        return PromiseExt.resolve<TResult>(Promise.race(...args));
    }

    constructor(executor?: PromiseExecutor<T>) {
        if ("withResolvers" in Promise && Promise.withResolvers) {
            // Proper ESNext approach
            // @ts-ignore since will error with target lower than ESNext
            const { promise, resolve, reject } = Promise.withResolvers<T>();
            this.#inner = promise;
            this.#resolve = resolve;
            this.#reject = reject;
        } else {
            // Dirty hack approach
            let resolve!: Resolve<T>, reject!: Reject;
            const promise = new Promise<T>((...args) => [resolve, reject] = args);
            this.#inner = promise;
            this.#resolve = resolve;
            this.#reject = reject;
        }
        this.#state = State.Pending;
        executor?.(this.resolve, this.reject, this.cancel);
    }

    /**
     * Resolves the promise as does the executor's `resolve` argument.
     * Can be used to resolve promise at any point without having that logic inside executor.
     */
    resolve: Resolve<T> = (...args) => {
        if (this.#state === State.Pending) {
            this.#state = State.Resolved;
            this.#resolve(...args);
        } else {
            PromiseExt.logger?.(`Attempted to resolve ${this.#state} promise.`);
        }
    }

    /**
     * Rejects the promise as does the executor's `reject` argument.
     * Can be used to reject promise at any point without having that logic inside executor.
     */
    reject: Reject = (...args) => {
        if (this.#state === State.Pending) {
            this.#state = State.Rejected;
            this.#reject(...args);
        } else {
            PromiseExt.logger?.(`Attempted to reject ${this.#state} promise.`);
        }
    }

    /**
     * Cancels the promise as does the executor's `cancel` argument.
     * Can be used to cancel promise at any point without having that logic inside executor.
     */
    cancel: Cancel = () => {
        if (this.#state === State.Pending) {
            this.#state = State.Canceled;
        } else {
            PromiseExt.logger?.(`Attempted to cancel ${this.#state} promise.`);
        }
    }

    /**
     * Does the same as method `then` of the native `Promise`. 
     * Returns native `Promise` for better performance.
     */
    then: Promise<T>["then"] = (...args) => {
        return this.#inner.then(...args);
    }

    /**
     * Does the same as method `catch` of the native `Promise`. 
     * Returns native `Promise` for better performance.
     */
    catch: Promise<T>["catch"] = (...args) => {
        return this.#inner.catch(...args);
    }

    /**
     * Does the same as method `finally` of the native `Promise`. 
     * Returns native `Promise` for better performance.
     */
    finally: Promise<T>["finally"] = (...args) => {
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

    get [Symbol.toStringTag]() {
        return "PromiseExt";
    }

}
