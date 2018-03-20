export enum State { Scheduled, Started, Finished, Canceled }

export type InitialAction = (resolve: Function, reject: Function) => any;

export type Action = (value: any) => any;
export enum ActionType { Resolver = 1, Rejector = 2, Finalizer = 3 }
export type ActionStack = { type: ActionType, action: Action }[];

export type UnhandledRejectionHandler = (error: any) => any;

export class PromiseExt {

    public static unhandledRejectionHandler: UnhandledRejectionHandler = (error: any) => {
        console.error("Unhandled promise rejection", error);
    }

    public state: State = State.Scheduled;
    public get isScheduled(): boolean { return this.state === State.Scheduled; }
    public get isStarted(): boolean { return this.state === State.Started; }
    public get isFinished(): boolean { return this.state === State.Finished; }
    public get isCanceled(): boolean { return this.state === State.Canceled; }
    public cancel = () => this.state = State.Canceled;

    private initialAction: InitialAction;
    private actions: ActionStack = [];
    private index: number = 0;
    private parent: PromiseExt | null = null;

    private result!: any;
    private hasError!: boolean;

    constructor(initialAction: InitialAction) {
        this.initialAction = initialAction;
        setTimeout(this.start);
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

    private start = (): void => {
        if (this.isScheduled) {
            this.state = State.Started;
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

    private exec = (): void => {
        if (this.isCanceled) return;
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
        }
        if (this.isStarted) {
            this.state = State.Finished;
            if (this.hasError && this.parent === null) {
                PromiseExt.unhandledRejectionHandler(this.result);
            }
        }
    }

    public then = (action: Action, rejector?: Action): this => {
        this.actions.push({ type: ActionType.Resolver, action });
        return rejector ? this.catch(rejector) : this;
    }

    public catch = (action: Action, rejector?: Action): this => {
        this.actions.push({ type: ActionType.Rejector, action });
        return rejector ? this.catch(rejector) : this;
    }

    public finally = (action: Action, rejector?: Action): this => {
        this.actions.push({ type: ActionType.Finalizer, action });
        return rejector ? this.catch(rejector) : this;
    }

}