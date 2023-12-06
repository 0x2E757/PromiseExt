export class PromiseExt<T = any> {

    private promise: Promise<T>;
    private parent: PromiseExt<unknown> | null;
    private children: PromiseExt<unknown>[] | null;

    public canceled: boolean;

    public constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void);
    public constructor(promise: Promise<T>, parent?: PromiseExt<unknown> | null);
    public constructor(arg1: any, arg2: any = null) {
        if (arg1.then === undefined) {
            this.promise = new Promise(arg1);
            this.parent = null;
        } else {
            this.promise = arg1;
            this.parent = arg2;
        }
        this.children = null;
        this.canceled = false;
    }

    public get [Symbol.toStringTag](): string {
        return "PromiseExt";
    }

    public then<U, V>(onFulfilled: (value: T) => U | PromiseLike<U>, onRejected?: (reason?: unknown) => V | PromiseLike<V>): PromiseExt<U | V> {
        if (this.canceled)
            return this as PromiseExt<any>;
        const onFulfilledWrapper = (value: T) => this.canceled || onFulfilled(value);
        const onRejectedWrapper = onRejected ? (reason?: unknown) => this.canceled || onRejected(reason) : undefined;
        const promise = this.promise.then(onFulfilledWrapper, onRejectedWrapper) as Promise<U | V>;
        const result = new PromiseExt(promise, this);
        this.children?.push(result) ?? (this.children = [result]);
        return result;
    }

    public catch<U>(onRejected: (reason?: unknown) => U | PromiseLike<U>): PromiseExt<T | U> {
        if (this.canceled)
            return this as PromiseExt<any>;
        const onRejectedWrapper = (reason?: unknown) => this.canceled || onRejected(reason);
        const promise = this.promise.catch(onRejectedWrapper) as Promise<T | U>;
        const result = new PromiseExt(promise, this);
        this.children?.push(result) ?? (this.children = [result]);
        return result;
    }

    public finally(onFinally: () => void): PromiseExt<T> {
        if (this.canceled)
            return this as PromiseExt<any>;
        const onFinallyWrapper = () => !this.canceled ? onFinally() : undefined;
        const promise = this.promise.finally(onFinallyWrapper) as Promise<T>;
        const result = new PromiseExt(promise, this);
        this.children?.push(result) ?? (this.children = [result]);
        return result;
    }

    public timeout<U = undefined>(delay: number, value?: U): PromiseExt<U extends undefined ? T : U> {
        if (this.canceled)
            return this as PromiseExt<any>;
        if (value === undefined) {
            const onFinallyWrapper = () => new Promise(resolve => setTimeout(resolve, delay));
            const promise = this.promise.finally(onFinallyWrapper) as Promise<T>;
            const result = new PromiseExt(promise, this) as PromiseExt<U extends undefined ? T : U>;
            this.children?.push(result) ?? (this.children = [result]);
            return result;
        } else {
            const onFulfilledWrapper = () => new Promise(resolve => setTimeout(resolve, delay, value));
            const promise = this.promise.then(onFulfilledWrapper) as Promise<U>;
            const result = new PromiseExt(promise, this) as PromiseExt<U extends undefined ? T : U>;
            this.children?.push(result) ?? (this.children = [result]);
            return result;
        }
    }

    public cancel(cancelParent: boolean = true): void {
        this.canceled = true;
        if (this.children)
            for (const child of this.children)
                if (!child.canceled)
                    child.cancel(false);
        if (cancelParent)
            this.parent?.cancel();
    }

    public static wrap<T>(promise: Promise<T>): PromiseExt<T> {
        return new PromiseExt(promise, null);
    }

    public static resolve<T = undefined>(value?: T | PromiseLike<T>): PromiseExt<T> {
        return new PromiseExt(Promise.resolve(value) as Promise<T>, null);
    }

    public static reject<T = undefined>(reason?: T): PromiseExt<T> {
        return new PromiseExt(Promise.reject(reason) as Promise<T>, null);
    }

    public static all<T extends unknown[]>(values: [...{ [K in keyof T]: T[K] | PromiseLike<T[K]> }]): PromiseExt<T> {
        const promise = Promise.all(values).catch((reason) => {
            for (const value of values)
                if (value instanceof PromiseExt)
                    value.cancel();
            return Promise.reject(reason);
        });
        return new PromiseExt(promise as PromiseExt<T>, null);
    }

    public static race<T>(values: T[]): PromiseExt<T extends PromiseLike<infer U> ? U : T> {
        const promise = Promise.race(values);
        return new PromiseExt(promise as PromiseExt<T extends PromiseLike<infer U> ? U : T>, null);
    }

    public static allSettled<T extends unknown[]>(values: [...{ [K in keyof T]: T[K] | PromiseLike<T[K]> }]): PromiseExt<[...{ [K in keyof T]: { status: "fulfilled", value: T[K] } | { status: "rejected", reason: unknown } }]> {
        // @ts-ignore : Method "allSettled" may not exist, polyfill might be required.
        const promise = Promise.allSettled(values);
        return new PromiseExt(promise as Promise<[...{ [K in keyof T]: { status: "fulfilled", value: T[K] } | { status: "rejected", reason: unknown } }]>, null);
    }

    public static any<T>(values: T[]): PromiseExt<T extends PromiseLike<infer U> ? U : T> {
        // @ts-ignore : Method "any" may not exist, polyfill might be required.
        const promise = Promise.any(values);
        return new PromiseExt(promise as PromiseExt<T extends PromiseLike<infer U> ? U : T>, null);
    }

    public static timeout<T = undefined>(delay: number, value?: T | PromiseLike<T>): PromiseExt<T> {
        return new PromiseExt(Promise.resolve(value) as Promise<T>, null).timeout(delay);
    }

}

export default PromiseExt;