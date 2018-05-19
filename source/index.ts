export enum State { Scheduled, Running, Finished, Canceled }

export type Action<TArgument = any, TResult = any> = (arg: TArgument) => TResult;
export enum ActionType { Resolver = 1, Rejector = 2, Finalizer = 3 }
export type ActionStack = { action: Action, type: ActionType }[];

export type InitialAction<TResolveValue> = (resolve: Action<TResolveValue>, reject: Action) => any;

export type Params = {
    deferStart: boolean;
    deferdActions: boolean;
    useSetImmediate: boolean;
};

export type UnhandledRejectionHandler = (error: any) => any;

export type ValueOrPromiseLike<T> = T | PromiseLike<T> | PromiseExt<T>;

export type PromiseExtAll = {
    <T>(values: { [Key in keyof T]: ValueOrPromiseLike<T[Key]> }): PromiseExt<T>;
    <T1>(values: [ValueOrPromiseLike<T1>]): PromiseExt<[T1]>;
    <T1, T2>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>]): PromiseExt<[T1, T2]>;
    <T1, T2, T3>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>]): PromiseExt<[T1, T2, T3]>;
    <T1, T2, T3, T4>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>]): PromiseExt<[T1, T2, T3, T4]>;
    <T1, T2, T3, T4, T5>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>]): PromiseExt<[T1, T2, T3, T4, T5]>;
    <T1, T2, T3, T4, T5, T6>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>, ValueOrPromiseLike<T6>]): PromiseExt<[T1, T2, T3, T4, T5, T6]>;
    <T1, T2, T3, T4, T5, T6, T7>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>, ValueOrPromiseLike<T6>, ValueOrPromiseLike<T7>]): PromiseExt<[T1, T2, T3, T4, T5, T6, T7]>;
    <T1, T2, T3, T4, T5, T6, T7, T8>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>, ValueOrPromiseLike<T6>, ValueOrPromiseLike<T7>, ValueOrPromiseLike<T8>]): PromiseExt<[T1, T2, T3, T4, T5, T6, T7, T8]>;
    <T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>, ValueOrPromiseLike<T6>, ValueOrPromiseLike<T7>, ValueOrPromiseLike<T8>, ValueOrPromiseLike<T9>]): PromiseExt<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
    <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>, ValueOrPromiseLike<T6>, ValueOrPromiseLike<T7>, ValueOrPromiseLike<T8>, ValueOrPromiseLike<T9>, ValueOrPromiseLike<T10>]): PromiseExt<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
};

export type PromiseExtRace = {
    <T1>(values: [ValueOrPromiseLike<T1>]): PromiseExt<T1>;
    <T1, T2>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>]): PromiseExt<T1 | T2>;
    <T1, T2, T3>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>]): PromiseExt<T1 | T2 | T3>;
    <T1, T2, T3, T4>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>]): PromiseExt<T1 | T2 | T3 | T4>;
    <T1, T2, T3, T4, T5>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>]): PromiseExt<T1 | T2 | T3 | T4 | T5>;
    <T1, T2, T3, T4, T5, T6>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>, ValueOrPromiseLike<T6>]): PromiseExt<T1 | T2 | T3 | T4 | T5 | T6>;
    <T1, T2, T3, T4, T5, T6, T7>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>, ValueOrPromiseLike<T6>, ValueOrPromiseLike<T7>]): PromiseExt<T1 | T2 | T3 | T4 | T5 | T6 | T7>;
    <T1, T2, T3, T4, T5, T6, T7, T8>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>, ValueOrPromiseLike<T6>, ValueOrPromiseLike<T7>, ValueOrPromiseLike<T8>]): PromiseExt<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>;
    <T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>, ValueOrPromiseLike<T6>, ValueOrPromiseLike<T7>, ValueOrPromiseLike<T8>, ValueOrPromiseLike<T9>]): PromiseExt<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>;
    <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(values: [ValueOrPromiseLike<T1>, ValueOrPromiseLike<T2>, ValueOrPromiseLike<T3>, ValueOrPromiseLike<T4>, ValueOrPromiseLike<T5>, ValueOrPromiseLike<T6>, ValueOrPromiseLike<T7>, ValueOrPromiseLike<T8>, ValueOrPromiseLike<T9>, ValueOrPromiseLike<T10>]): PromiseExt<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10>;
};

const isPromiseLike = (value: any): boolean => typeof value === "object" && typeof value.then === "function";

const allArray = (values: ValueOrPromiseLike<any>[]): PromiseExt<any> => {

    const results: any[] = [];
    const done: boolean[] = [];

    return new PromiseExt((resolve, reject) => {

        const tryResolve = (index: number) => (value: any): void => {
            results[index] = value;
            done[index] = true;
            for (let n: number = 0; n < done.length; n++) {
                if (done[n] === false) return;
            }
            resolve(results);
        };

        for (let n: number = 0; n < values.length; n++) {
            const value = values[n];
            const isPromiseOrPromiseLike = value instanceof PromiseExt || value instanceof Promise || isPromiseLike(value);
            if (isPromiseOrPromiseLike) {
                results.push(value);
                done.push(false);
                value.then(tryResolve(n), reject);
            } else {
                results.push(value);
                done.push(true);
            }
        }

    });

};

const allObject = (values: { [Key: string]: ValueOrPromiseLike<any> }): PromiseExt<any> => {

    const results: { [Key: string]: any } = {};
    const done: { [Key: string]: boolean } = {};

    return new PromiseExt<any>((resolve, reject) => {

        const tryResolve = (key: string) => (value: any): void => {
            results[key] = value;
            done[key] = true;
            for (const key in values) if (done[key] === false) return;
            resolve(results);
        };

        for (const key in values) {
            const value = values[key];
            const isPromiseOrPromiseLike = value instanceof PromiseExt || value instanceof Promise || isPromiseLike(value);
            if (isPromiseOrPromiseLike) {
                results[key] = value;
                done[key] = false;
                value.then(tryResolve(key), reject);
            } else {
                results[key] = value;
                done[key] = true;
            }
        }

    });

};

const race: PromiseExtRace = (values: any) => {

    const cancelablePromises: PromiseExt<any>[] = [];
    let resolved: boolean = false;

    return new PromiseExt<any>((resolve, reject) => {

        const resolver = (value: any): void => {
            if (resolved) return;
            for (const promise of cancelablePromises) {
                if (promise instanceof PromiseExt) promise.cancel();
            }
            resolve(value);
            resolved = true;
        };

        for (let n: number = 0; n < values.length; n++) {
            const value = values[n];
            const isPromiseOrPromiseLike = value instanceof PromiseExt || value instanceof Promise || isPromiseLike(value);
            if (isPromiseOrPromiseLike) {
                if (value instanceof PromiseExt) cancelablePromises.push(value);
                value.then(resolver, reject);
            } else {
                return resolver(value);
            }
        }

    });

};

export class PromiseExt<TResult> {

    public static onUnhandledRejection: UnhandledRejectionHandler = (error: any) => {
        console.error("Unhandled promise rejection", error);
    }

    public static all: PromiseExtAll = (values: any) => Array.isArray(values) ? allArray(values) : allObject(values);
    public static race: PromiseExtRace = race;

    public state: State = State.Scheduled;
    public get isScheduled(): boolean { return this.state === State.Scheduled; }
    public get isRunning(): boolean { return this.state === State.Running; }
    public get isFinished(): boolean { return this.state === State.Finished; }
    public get isCanceled(): boolean { return this.state === State.Canceled; }
    public cancel = () => this.state = State.Canceled;

    public params: Params;

    private initialAction: InitialAction<TResult>;
    private actions: ActionStack = [];
    private index: number = 0;
    private parent: PromiseExt<any> | null = null;

    private result!: TResult;
    private hasError!: boolean;
    private exceptionTimeoutHandler: number = 0;

    constructor(initialAction: InitialAction<TResult>, parameters?: Partial<Params>) {
        this.params = {
            deferStart: false,
            deferdActions: false,
            useSetImmediate: false,
            ...parameters,
        };
        this.initialAction = initialAction;
        this.params.deferStart ? this.deferStart() : this.start();
    }

    private resolve = (value: any): void => {
        this.result = value;
        this.hasError = false;
        this.exec();
    }

    private reject = (value: any): void => {
        this.result = value;
        this.hasError = true;
        this.exec();
    }

    private deferStart = () => {
        if (this.params.useSetImmediate) {
            setImmediate(this.start);
        } else {
            setTimeout(this.start);
        }
    }

    private start = (): void => {
        if (this.isScheduled) {
            this.state = State.Running;
            try {
                this.initialAction(this.resolve, this.reject);
            } catch (error) {
                this.reject(error);
            }
        }
    }

    private onThen = (action: Action): void => {
        if (this.hasError === false) {
            try {
                this.result = action(this.result);
                this.hasError = false;
            } catch (error) {
                this.result = error;
                this.hasError = true;
            }
        }
    }

    private onCatch = (action: Action): void => {
        if (this.hasError === true) {
            try {
                this.result = action(this.result);
                this.hasError = false;
            } catch (error) {
                this.result = error;
                this.hasError = true;
            }
        }
    }

    private onFinally = (action: Action): void => {
        try {
            action(undefined);
        } catch (error) {
            this.result = error;
            this.hasError = true;
        }
    }

    private onExceptionGenerator = (error: any, index: number) => () => {
        if (index === this.actions.length) {
            PromiseExt.onUnhandledRejection(error);
        }
    }

    private execRunAction = (actionsItem: { action: Action, type: ActionType }): void => {
        switch (actionsItem.type) {
            case ActionType.Resolver: return this.onThen(actionsItem.action);
            case ActionType.Rejector: return this.onCatch(actionsItem.action);
            case ActionType.Finalizer: return this.onFinally(actionsItem.action);
        }
    }

    private execHandleResult = (): boolean => {
        if (this.result instanceof PromiseExt) {
            const resolver = this.hasError ? this.reject : this.resolve;
            this.result.then(resolver, this.reject).parent = this;
            return true;
        }
        if (this.result instanceof Promise) {
            const resolver = this.hasError ? this.reject : this.resolve;
            this.result.then(resolver, this.reject);
            return true;
        }
        if (isPromiseLike(this.result)) {
            const resolver = this.hasError ? this.reject : this.resolve;
            (this.result as any).then(resolver, this.reject);
            return true;
        }
        if (this.params.deferdActions) {
            this.params.useSetImmediate ? setImmediate(this.exec) : setTimeout(this.exec);
            return true;
        }
        return false;
    }

    private exec = (): void => {
        if (this.isCanceled) return;
        this.state = State.Running;
        while (this.index < this.actions.length) {
            this.execRunAction(this.actions[this.index++]);
            if (this.execHandleResult()) return;
        }
        if (this.isRunning) {
            this.state = State.Finished;
            if (this.hasError && this.parent === null) {
                if (this.exceptionTimeoutHandler) clearTimeout(this.exceptionTimeoutHandler);
                const onException = this.onExceptionGenerator(this.result, this.index);
                this.exceptionTimeoutHandler = setTimeout(onException);
            }
        }
    }

    private addAction = (action: Action, type: ActionType): void => {
        this.actions.push({ action, type });
        if (this.isFinished) this.exec();
    }

    public then = <TNewResult>(action: Action<TResult, TNewResult>, rejector?: Action): PromiseExt<TNewResult> => {
        this.addAction(action, ActionType.Resolver);
        return rejector ? this.catch(rejector) : this as any;
    }

    public catch = <TNewResult>(action: Action<any, TNewResult>, rejector?: Action): PromiseExt<TNewResult> => {
        this.addAction(action, ActionType.Rejector);
        return rejector ? this.catch(rejector) : this as any;
    }

    public finally = <TNewResult>(action: Action<TResult, TNewResult>, rejector?: Action): PromiseExt<TNewResult> => {
        this.addAction(action, ActionType.Finalizer);
        return rejector ? this.catch(rejector) : this as any;
    }

}

export default PromiseExt;