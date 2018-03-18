export enum State { Scheduled, Executed, Canceled, Fulfilled, Rejected }

export type Executor = (resolve: Function, reject: Function) => any;
export type Action = (value: any) => any;
export enum ActionType { NormalAction, ErrorHandler }
export type ActionStack = { type: ActionType, action: Action }[];

export type FailHandler = (error: any) => any;
export type SuccessHandler = (result: any) => any;

export class PromiseExt {

    public static onFail: FailHandler = (error: any) => console.error("Unhandled promise error", error);
    public static onSuccess: SuccessHandler | null;

    public state: State = State.Scheduled;
    public get isScheduled(): boolean { return this.state === State.Scheduled; }
    public get isExecuted(): boolean { return this.state === State.Executed; }
    public get isCanceled(): boolean { return this.state === State.Canceled; }
    public get isFulfilled(): boolean { return this.state === State.Fulfilled; }
    public get isRejected(): boolean { return this.state === State.Rejected; }
    public cancel = () => this.state = State.Canceled;

    private executor: Executor;
    private actions: ActionStack = [];
    private index: number = 0;

    private parent: PromiseExt | null = null;

    constructor(executor: Executor) {
        this.executor = executor;
        setTimeout(this.start);
    }

    private start = () => {
        if (this.isScheduled) {
            this.state = State.Executed;
            try { this.executor(this.processNormal, this.handleError); }
            catch (error) { this.processError(error); }
        }
    }

    private processNormal = (value: any) => {
        try { this.handleAction(value); }
        catch (error) { this.handleError(error); }
    }

    private processError = (value: any) => {
        try { this.handleError(value); }
        catch (error) { this.handleError(error); }
    }

    private awaitChild = (promise: PromiseExt) => {
        if (this.index === this.actions.length) this.then(() => { });
        promise.then(this.processNormal, this.processError);
        promise.parent = this;
    }

    private execute = (value: any, type: ActionType) => {
        while (this.index < this.actions.length) {
            const index = this.index++;
            if (this.actions[index].type === type) {
                const result = this.actions[index].action(value);
                return result instanceof PromiseExt ? this.awaitChild(result) : this.processNormal(result);
            }
        }
    }

    private handleAction = (value: any) => {
        this.execute(value, ActionType.NormalAction);
        if (this.index === this.actions.length && this.isExecuted) {
            this.state = State.Fulfilled;
            if (PromiseExt.onSuccess && this.parent === null) {
                PromiseExt.onSuccess(value);
            }
        }
    }

    private handleError = (error: any) => {
        this.execute(error, ActionType.ErrorHandler);
        if (this.index === this.actions.length && this.isExecuted) {
            this.state = State.Rejected;
            if (this.parent) return this.parent.processError(error);
            if (PromiseExt.onFail) PromiseExt.onFail(error);
        }
    }

    public then = (action: Action, errorHandler?: Action) => {
        const type = ActionType.NormalAction;
        this.actions.push({ type, action });
        return errorHandler ? this.catch(errorHandler) : this;
    }

    public catch = (action: Action) => {
        const type = ActionType.ErrorHandler;
        this.actions.push({ type, action });
        return this;
    }

}