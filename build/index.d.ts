export declare enum State {
    Scheduled = 0,
    Running = 1,
    Finished = 2,
    Canceled = 3
}
export declare type Action<TArgument = any, TResult = any> = (arg: TArgument) => TResult;
export declare enum ActionType {
    Resolver = 1,
    Rejector = 2,
    Finalizer = 3
}
export declare type ActionStack = {
    action: Action;
    type: ActionType;
}[];
export declare type InitialAction<TResolveValue> = (resolve: Action<TResolveValue>, reject: Action) => any;
export declare type Params = {
    deferStart: boolean;
    deferdActions: boolean;
    useSetImmediate: boolean;
};
export declare type UnhandledRejectionHandler = (error: any) => any;
export declare type ValueOrPromiseLike<T> = T | PromiseLike<T> | PromiseExt<T>;
export declare type PromiseExtAll = {
    <T>(values: {
        [Key in keyof T]: ValueOrPromiseLike<T[Key]>;
    }): PromiseExt<T>;
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
export declare type PromiseExtRace = {
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
export declare class PromiseExt<TResult> {
    static onUnhandledRejection: UnhandledRejectionHandler;
    static all: PromiseExtAll;
    static race: PromiseExtRace;
    state: State;
    isScheduled: () => boolean;
    isRunning: () => boolean;
    isFinished: () => boolean;
    isCanceled: () => boolean;
    cancel: () => void;
    params: Params;
    private initialAction;
    private actions;
    private index;
    private parent;
    private result;
    private hasError;
    private exceptionTimeoutHandler;
    constructor(initialAction: InitialAction<TResult>, parameters?: Partial<Params>);
    private resolve;
    private reject;
    private deferStart;
    private start;
    private onThen;
    private onCatch;
    private onFinally;
    private onExceptionGenerator;
    private execRunAction;
    private execHandleResult;
    private exec;
    private addAction;
    then: <TNewResult>(action: Action<TResult, TNewResult>, rejector?: Action<any, any> | undefined) => PromiseExt<TNewResult>;
    catch: <TNewResult>(action: Action<any, TNewResult>, rejector?: Action<any, any> | undefined) => PromiseExt<TNewResult>;
    finally: <TNewResult>(action: Action<TResult, TNewResult>, rejector?: Action<any, any> | undefined) => PromiseExt<TNewResult>;
}
export default PromiseExt;
//# sourceMappingURL=index.d.ts.map