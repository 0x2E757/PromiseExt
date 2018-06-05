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
const isPromiseLike = (value) => typeof value === "object" && typeof value.then === "function";
const allArray = (values) => {
    const results = [];
    const done = [];
    return new PromiseExt((resolve, reject) => {
        const resolveWrapper = (index) => (value) => {
            results[index] = value;
            done[index] = true;
            for (let n = 0; n < done.length; n++)
                if (done[n] === false)
                    return;
            resolve(results);
        };
        const rejectWrapper = (index) => (avalue) => {
            for (let n = 0; n < values.length; n++) {
                const value = values[n];
                if (n !== index && done[n] !== false) {
                    if (value instanceof PromiseExt || typeof value.cancel === "function") {
                        value.cancel();
                    }
                }
            }
            reject(avalue);
        };
        for (let n = 0; n < values.length; n++) {
            const value = values[n];
            const isPromiseOrPromiseLike = value instanceof PromiseExt || value instanceof Promise || isPromiseLike(value);
            if (isPromiseOrPromiseLike) {
                results.push(value);
                done.push(false);
                value.then(resolveWrapper(n), rejectWrapper(n));
            }
            else {
                results.push(value);
                done.push(true);
            }
        }
    });
};
const allObject = (values) => {
    const results = {};
    const done = {};
    return new PromiseExt((resolve, reject) => {
        const resolveWrapper = (akey) => (value) => {
            results[akey] = value;
            done[akey] = true;
            for (const key in values)
                if (done[key] === false)
                    return;
            resolve(results);
        };
        const rejectWrapper = (akey) => (avalue) => {
            for (const key in values) {
                const value = values[key];
                if (key !== akey && done[akey] !== false) {
                    if (value instanceof PromiseExt || typeof value.cancel === "function") {
                        value.cancel();
                    }
                }
            }
            reject(avalue);
        };
        for (const key in values) {
            const value = values[key];
            const isPromiseOrPromiseLike = value instanceof PromiseExt || value instanceof Promise || isPromiseLike(value);
            if (isPromiseOrPromiseLike) {
                results[key] = value;
                done[key] = false;
                value.then(resolveWrapper(key), rejectWrapper(key));
            }
            else {
                results[key] = value;
                done[key] = true;
            }
        }
    });
};
const race = (values) => {
    const cancelablePromises = [];
    let resolved = false;
    return new PromiseExt((resolve, reject) => {
        const resolveWrapper = (value) => {
            if (resolved)
                return;
            for (const promise of cancelablePromises) {
                if (value instanceof PromiseExt || typeof value.cancel === "function") {
                    promise.cancel();
                }
            }
            resolve(value);
            resolved = true;
        };
        const rejectWrapper = (index) => (avalue) => {
            if (resolved)
                return;
            for (let n = 0; n < values.length; n++) {
                const value = values[n];
                if (n !== index && (value instanceof PromiseExt || typeof value.cancel === "function")) {
                    value.cancel();
                }
            }
            reject(avalue);
        };
        for (let n = 0; n < values.length; n++) {
            const value = values[n];
            const isPromiseOrPromiseLike = value instanceof PromiseExt || value instanceof Promise || isPromiseLike(value);
            if (isPromiseOrPromiseLike) {
                if (value instanceof PromiseExt)
                    cancelablePromises.push(value);
                value.then(resolveWrapper, rejectWrapper(n));
            }
            else {
                return resolveWrapper(value);
            }
        }
    });
};
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
        this.onExceptionGenerator = (error, index) => () => {
            if (index === this.actions.length) {
                PromiseExt.onUnhandledRejection(error);
            }
        };
        this.execRunAction = (actionsItem) => {
            switch (actionsItem.type) {
                case ActionType.Resolver: return this.onThen(actionsItem.action);
                case ActionType.Rejector: return this.onCatch(actionsItem.action);
                case ActionType.Finalizer: return this.onFinally(actionsItem.action);
            }
        };
        this.execHandleResult = () => {
            if (this.result instanceof PromiseExt) {
                const resolver = this.hasError ? this.reject : this.resolve;
                this.result.then(resolver, this.reject).parent = this;
                return true;
            }
            if (this.result instanceof Promise) {
                const resolver = this.hasError ? this.reject : this.resolve;
                this.result.then(resolver, this.reject);
                return true;
            }
            if (isPromiseLike(this.result)) {
                const resolver = this.hasError ? this.reject : this.resolve;
                this.result.then(resolver, this.reject);
                return true;
            }
            if (this.params.deferdActions) {
                this.params.useSetImmediate ? setImmediate(this.exec) : setTimeout(this.exec);
                return true;
            }
            return false;
        };
        this.exec = () => {
            if (this.isCanceled)
                return;
            this.state = State.Running;
            while (this.index < this.actions.length) {
                this.execRunAction(this.actions[this.index++]);
                if (this.execHandleResult())
                    return;
            }
            if (this.isRunning) {
                this.state = State.Finished;
                if (this.hasError && this.parent === null) {
                    if (this.exceptionTimeoutHandler)
                        clearTimeout(this.exceptionTimeoutHandler);
                    const onException = this.onExceptionGenerator(this.result, this.index);
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
PromiseExt.all = (values) => Array.isArray(values) ? allArray(values) : allObject(values);
PromiseExt.race = race;
exports.PromiseExt = PromiseExt;
exports.default = PromiseExt;
//# sourceMappingURL=index.js.map