"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var State;
(function (State) {
    State[State["Scheduled"] = 0] = "Scheduled";
    State[State["Running"] = 1] = "Running";
    State[State["Finished"] = 2] = "Finished";
    State[State["Canceled"] = 3] = "Canceled";
})(State = exports.State || (exports.State = {}));
var ActionType;
(function (ActionType) {
    ActionType[ActionType["Resolver"] = 1] = "Resolver";
    ActionType[ActionType["Rejector"] = 2] = "Rejector";
    ActionType[ActionType["Finalizer"] = 3] = "Finalizer";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
class PromiseExt {
    constructor(initialAction, parameters) {
        this.state = State.Scheduled;
        this.cancel = () => this.state = State.Canceled;
        this.actions = [];
        this.index = 0;
        this.parent = null;
        this.exceptionTimeoutHandler = 0;
        this.resolve = (value) => {
            this.result = value;
            this.hasError = false;
            this.exec();
        };
        this.reject = (value) => {
            this.result = value;
            this.hasError = true;
            this.exec();
        };
        this.deferStart = () => {
            if (this.params.useSetImmediate) {
                setImmediate(this.start);
            }
            else {
                setTimeout(this.start);
            }
        };
        this.start = () => {
            if (this.isScheduled) {
                this.state = State.Running;
                try {
                    this.initialAction(this.resolve, this.reject);
                }
                catch (error) {
                    this.reject(error);
                }
            }
        };
        this.onThen = (action) => {
            if (this.hasError === false) {
                try {
                    this.result = action(this.result);
                    this.hasError = false;
                }
                catch (error) {
                    this.result = error;
                    this.hasError = true;
                }
            }
        };
        this.onCatch = (action) => {
            if (this.hasError === true) {
                try {
                    this.result = action(this.result);
                    this.hasError = false;
                }
                catch (error) {
                    this.result = error;
                    this.hasError = true;
                }
            }
        };
        this.onFinally = (action) => {
            try {
                action(undefined);
            }
            catch (error) {
                this.result = error;
                this.hasError = true;
            }
        };
        this.onException = (error, index) => () => {
            if (index === this.actions.length) {
                PromiseExt.onUnhandledRejection(error);
            }
        };
        this.exec = () => {
            if (this.isCanceled)
                return;
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
                    if (this.exceptionTimeoutHandler)
                        clearTimeout(this.exceptionTimeoutHandler);
                    const onException = this.onException(this.result, this.index);
                    this.exceptionTimeoutHandler = setTimeout(onException);
                }
            }
        };
        this.addAction = (action, type) => {
            this.actions.push({ action, type });
            if (this.isFinished)
                this.exec();
        };
        this.then = (action, rejector) => {
            this.addAction(action, ActionType.Resolver);
            return rejector ? this.catch(rejector) : this;
        };
        this.catch = (action, rejector) => {
            this.addAction(action, ActionType.Rejector);
            return rejector ? this.catch(rejector) : this;
        };
        this.finally = (action, rejector) => {
            this.addAction(action, ActionType.Finalizer);
            return rejector ? this.catch(rejector) : this;
        };
        this.params = {
            deferStart: false,
            deferdActions: false,
            useSetImmediate: false,
            ...parameters,
        };
        this.initialAction = initialAction;
        this.params.deferStart ? this.deferStart() : this.start();
    }
    get isScheduled() { return this.state === State.Scheduled; }
    get isRunning() { return this.state === State.Running; }
    get isFinished() { return this.state === State.Finished; }
    get isCanceled() { return this.state === State.Canceled; }
}
PromiseExt.onUnhandledRejection = (error) => {
    console.error("Unhandled promise rejection", error);
};
exports.PromiseExt = PromiseExt;
exports.default = PromiseExt;
