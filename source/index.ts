export enum State { Scheduled, Executed, Canceled, Fulfilled, Rejected }

export type InitialAction = (resolve: Function, reject: Function) => any;
export type Action = (value: any) => any;
export enum ActionType { Resolver = 1, Rejector = 2, Finalizer = 3 }
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
            try { this.initialAction(this.onThen, this.onCatch); }
            catch (error) { this.onCatch(error); }
        }
    }

    private exec = (value: any, actionType: ActionType, finalizer: Function | null) => {
        if (this.isCanceled) return;
        while (this.index < this.actions.length) {
            const index = this.index++;
            if (this.actions[index].type & actionType) {
                return this.handleAction(this.actions[index].action, value);
            }
        }
        if (finalizer) finalizer(value);
    }

    private onThen = (value: any): any => {
        const finalizer = this.parent ? this.parent.onThen : PromiseExt.onSuccess;
        this.exec(value, ActionType.Resolver, finalizer);
    }

    private onCatch = (value: any): any => {
        const finalizer = this.parent ? this.parent.onCatch : PromiseExt.onFail;
        this.exec(value, ActionType.Rejector, finalizer);
    }

    private awaitChild = (promise: PromiseExt) => {
        promise.then(this.onThen, this.onCatch).parent = this;
    }

    private handleAction = (action: Action, value: any) => {
        try {
            const result = action(value);
            result instanceof PromiseExt ? this.awaitChild(result) : this.onThen(result);
        } catch (error) { this.onCatch(error); }
    }

    public then = (action: Action, rejector?: Action): this => {
        this.actions.push({ type: ActionType.Resolver, action });
        return rejector ? this.catch(rejector) : this;
    }

    public catch = (action: Action, rejector?: Action): this => {
        this.actions.push({ type: ActionType.Rejector, action });
        return rejector ? this.catch(rejector) : this;
    }

    public finally = (action: Action, rejector?: Action) => {
        this.actions.push({ type: ActionType.Finalizer, action });
        return rejector ? this.catch(rejector) : this;
    }

}