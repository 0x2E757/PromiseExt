export enum State { Scheduled, Running, Finished, Canceled }

export type Action<TArgument = any, TResult = any> = (arg: TArgument) => TResult;
export enum ActionType { Resolver = 1, Rejector = 2, Finalizer = 3 }
export type ActionStack = { action: Action, type: ActionType }[];

export type InitialAction<TResolveValue> = (resolve: Action<TResolveValue>, reject: Action) => any;

export type UnhandledRejectionHandler = (error: any) => any;

export type Params = {
    deferStart: boolean;
    deferdActions: boolean;
    useSetImmediate: boolean;
};

export class PromiseExt<TResult> {

    public static onUnhandledRejection: UnhandledRejectionHandler = (error: any) => {
        console.error("Unhandled promise rejection", error);
    }

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

    private onException = (error: any, index: number) => () => {
        if (index === this.actions.length) {
            PromiseExt.onUnhandledRejection(error);
        }
    }

    private exec = (): void => {
        if (this.isCanceled) return;
        this.state = State.Running;
        while (this.index < this.actions.length) {
            const index = this.index++;
            switch (this.actions[index].type) {
                case ActionType.Resolver: {
                    this.onThen(this.actions[index].action);
                    break;
                }
                case ActionType.Rejector: {
                    this.onCatch(this.actions[index].action);
                    break;
                }
                case ActionType.Finalizer: {
                    this.onFinally(this.actions[index].action);
                    break;
                }
            }
            if (this.result instanceof PromiseExt) {
                this.result.then(this.resolve, this.reject).parent = this;
                return;
            }
            if (this.params.deferdActions) {
                this.params.useSetImmediate ? setImmediate(this.exec) : setTimeout(this.exec);
                return;
            }
        }
        if (this.isRunning) {
            this.state = State.Finished;
            if (this.hasError && this.parent === null) {
                if (this.exceptionTimeoutHandler) clearTimeout(this.exceptionTimeoutHandler);
                const onException = this.onException(this.result, this.index);
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

    public catch = <TNewResult>(action: Action<TResult, TNewResult>, rejector?: Action): PromiseExt<TResult | TNewResult> => {
        this.addAction(action, ActionType.Rejector);
        return rejector ? this.catch(rejector) : this as any;
    }

    public finally = <TNewResult>(action: Action<TResult, TNewResult>, rejector?: Action): PromiseExt<TNewResult> => {
        this.addAction(action, ActionType.Finalizer);
        return rejector ? this.catch(rejector) : this as any;
    }

}

export default PromiseExt;

/*

    TODO:
    1. Support promise-like values in then/catch/finally
    2. Implement PromiseExt.all with array or object as argument

*/