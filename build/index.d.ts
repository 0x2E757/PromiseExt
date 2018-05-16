export declare enum State {
    Scheduled = 0,
    Running = 1,
    Finished = 2,
    Canceled = 3,
}
export declare type InitialAction = (resolve: Function, reject: Function) => any;
export declare type Action = (value: any) => any;
export declare enum ActionType {
    Resolver = 1,
    Rejector = 2,
    Finalizer = 3,
}
export declare type ActionStack = {
    action: Action;
    type: ActionType;
}[];
export declare type UnhandledRejectionHandler = (error: any) => any;
export declare type Params = {
    deferStart: boolean;
    deferdActions: boolean;
    useSetImmediate: boolean;
};
export declare class PromiseExt {
    static onUnhandledRejection: UnhandledRejectionHandler;
    state: State;
    readonly isScheduled: boolean;
    readonly isRunning: boolean;
    readonly isFinished: boolean;
    readonly isCanceled: boolean;
    cancel: () => State;
    params: Params;
    private initialAction;
    private actions;
    private index;
    private parent;
    private result;
    private hasError;
    private exceptionTimeoutHandler;
    constructor(initialAction: InitialAction, parameters?: Partial<Params>);
    private resolve;
    private reject;
    private deferStart;
    private start;
    private onThen;
    private onCatch;
    private onFinally;
    private onException;
    private exec;
    private addAction;
    then: (action: Action, rejector?: Action | undefined) => this;
    catch: (action: Action, rejector?: Action | undefined) => this;
    finally: (action: Action, rejector?: Action | undefined) => this;
}
export default PromiseExt;
