export enum State { Scheduled, Executed, Canceled, Fulfilled, Rejected }

export type Executor = (resolve: Function, reject: Function) => any;
export type Action = (value: any) => any;

export enum ActionType { NormalAction, ErrorHandler }
export type ActionStack = { type: ActionType, action: Action }[];

export type FailHandler = (error: any) => any;

export class PromiseExt {

    public static onFail: FailHandler = (error: any) => console.warn("Unhandled promise error:", error);

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

    constructor(executor: Executor) {
        this.executor = executor;
        setTimeout(this.start);
    }

    private start = () => {
        if (this.isScheduled) {
            this.state = State.Executed;
            try { this.executor(this.process, this.handleError); }
            catch (error) { this.process(error, true); }
        }
    }

    private process = (value: any, error?: boolean) => {
        if (error === true) {
            try { this.handleError(value); }
            catch (error) { this.handleError(error); }
        } else {
            try { this.processAction(value); }
            catch (error) { this.handleError(error); }
        }
    }

    private processAction = (value: any) => {
        while (this.index < this.actions.length) {
            const index = this.index++;
            if (this.actions[index].type === ActionType.NormalAction) {
                const result = this.actions[index].action(value);
                if (result instanceof PromiseExt) {
                    return result.then(this.process);
                } else {
                    return this.process(result);
                }
            }
        }
        this.state = State.Fulfilled;
    }

    private handleError = (error: any) => {
        while (this.index < this.actions.length) {
            const index = this.index++;
            if (this.actions[index].type === ActionType.ErrorHandler) {
                const result = this.actions[index].action(error);
                if (result instanceof PromiseExt) {
                    return result.then(this.process);
                } else {
                    return this.process(result);
                }
            }
        }
        this.state = State.Rejected;
        PromiseExt.onFail(error);
    }

    public then = (action: Action) => {
        const type = ActionType.NormalAction;
        this.actions.push({ type, action });
        return this;
    }

    public catch = (action: Action) => {
        const type = ActionType.ErrorHandler;
        this.actions.push({ type, action });
        return this;
    }

}