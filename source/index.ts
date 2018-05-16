export enum State { Scheduled, Running, Finished, Canceled }

export type InitialAction = (resolve: Function, reject: Function) => any;

export type Action = (value: any) => any;
export enum ActionType { Resolver = 1, Rejector = 2, Finalizer = 3 }
export type ActionStack = { action: Action, type: ActionType }[];

export type UnhandledRejectionHandler = (error: any) => any;

export type Params = {
    deferStart: boolean;
    deferdActions: boolean;
    useSetImmediate: boolean;
};

export class PromiseExt {

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

    private initialAction: InitialAction;
    private actions: ActionStack = [];
    private index: number = 0;
    private parent: PromiseExt | null = null;

    private result!: any;
    private hasError!: boolean;
    private exceptionTimeoutHandler: number = 0;

    constructor(initialAction: InitialAction, parameters?: Partial<Params>) {
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

    public then = (action: Action, rejector?: Action): this => {
        this.addAction(action, ActionType.Resolver);
        return rejector ? this.catch(rejector) : this;
    }

    public catch = (action: Action, rejector?: Action): this => {
        this.addAction(action, ActionType.Rejector);
        return rejector ? this.catch(rejector) : this;
    }

    public finally = (action: Action, rejector?: Action): this => {
        this.addAction(action, ActionType.Finalizer);
        return rejector ? this.catch(rejector) : this;
    }

}

export default PromiseExt;