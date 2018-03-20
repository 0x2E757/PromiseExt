export enum State { Scheduled, Executed, Canceled, Fulfilled, Rejected }

export type InitialAction = (resolve: Function, reject: Function) => any;
export type Action = (value: any) => any;
export enum ActionType { NormalAction, ErrorHandler }
export type ActionStack = { type: ActionType, action: Action }[];

export type FailHandler = (error: any) => any;
export type SuccessHandler = (result: any) => any;

export class PromiseExt {

    public static onSuccess: SuccessHandler | null = null;
    public static onFail: FailHandler = (error: any) => console.error("Unhandled promise error", error);

    public state: State = State.Scheduled;
    public get isScheduled(): boolean { return this.state === State.Scheduled; }
    public get isExecuted(): boolean { return this.state === State.Executed; }
    public get isCanceled(): boolean { return this.state === State.Canceled; }
    public get isFulfilled(): boolean { return this.state === State.Fulfilled; }
    public get isRejected(): boolean { return this.state === State.Rejected; }
    public cancel = () => this.state = State.Canceled;

    private initialAction: InitialAction;
    private actions: ActionStack = [];
    private index: number = 0;

    private parent: PromiseExt | null = null;

    constructor(initialAction: InitialAction) {
        this.initialAction = initialAction;
        setTimeout(this.start);
    }

    private start = () => {
        if (this.isScheduled) {
            this.state = State.Executed;
            try { this.initialAction(this.execNormalAction, this.execErrorHandler); }
            catch (error) { this.execErrorHandler(error); }
        }
    }

    private exec = (value: any, actionType: ActionType, finalizer: Function | null) => {
        if (this.isCanceled) return;
        while (this.index < this.actions.length) {
            const index = this.index++;
            if (this.actions[index].type === actionType) {
                return this.handleAction(this.actions[index].action, value);
            }
        }
        if (finalizer) finalizer(value);
    }

    private execNormalAction = (value: any): any => {
        const finalizer = this.parent ? this.parent.execNormalAction : PromiseExt.onSuccess;
        this.exec(value, ActionType.NormalAction, finalizer);
    }

    private execErrorHandler = (value: any): any => {
        const finalizer = this.parent ? this.parent.execErrorHandler : PromiseExt.onFail;
        this.exec(value, ActionType.ErrorHandler, finalizer);
    }

    private awaitChild = (promise: PromiseExt) => {
        promise.then(this.execNormalAction, this.execErrorHandler).parent = this;
    }

    private handleAction = (action: Action, value: any) => {
        try {
            const result = action(value);
            result instanceof PromiseExt ? this.awaitChild(result) : this.execNormalAction(result);
        } catch (error) { this.execErrorHandler(error); }
    }

    public then = (action: Action, errorHandler?: Action) => {
        this.actions.push({ type: ActionType.NormalAction, action });
        return errorHandler ? this.catch(errorHandler) : this;
    }

    public catch = (action: Action) => {
        this.actions.push({ type: ActionType.ErrorHandler, action });
        return this;
    }
    
}