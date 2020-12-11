export declare class PromiseExt<T> {
    private promise;
    private parent;
    private children;
    canceled: boolean;
    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void);
    constructor(promise: Promise<T>, parent: PromiseExt<unknown> | null);
    get [Symbol.toStringTag](): string;
    then<U, V>(onFulfilled: (value: T) => U | PromiseLike<U>, onRejected?: (reason?: unknown) => V | PromiseLike<V>): PromiseExt<U | V>;
    catch<U>(onRejected: (reason?: unknown) => U | PromiseLike<U>): PromiseExt<T | U>;
    finally(onFinally: () => void): PromiseExt<T>;
    timeout<U = undefined>(delay: number, value?: U): PromiseExt<U extends undefined ? T : U>;
    cancel(cancelParent?: boolean): void;
    static wrap<T>(promise: Promise<T>): PromiseExt<T>;
    static resolve<T = undefined>(value?: T | PromiseLike<T>): PromiseExt<T>;
    static reject<T = undefined>(reason?: T): PromiseExt<T>;
    static all<T extends unknown[]>(values: [...{
        [K in keyof T]: T[K] | PromiseLike<T[K]>;
    }]): PromiseExt<T>;
    static race<T>(values: T[]): PromiseExt<T extends PromiseLike<infer U> ? U : T>;
    static allSettled<T extends unknown[]>(values: [...{
        [K in keyof T]: T[K] | PromiseLike<T[K]>;
    }]): PromiseExt<[...{
        [K in keyof T]: {
            status: "fulfilled";
            value: T[K];
        } | {
            status: "rejected";
            reason: unknown;
        };
    }]>;
    static any<T>(values: T[]): PromiseExt<T extends PromiseLike<infer U> ? U : T>;
}
export default PromiseExt;
//# sourceMappingURL=index.d.ts.map