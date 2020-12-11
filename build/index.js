"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseExt = void 0;
class PromiseExt {
    constructor(arg1, arg2) {
        if (arg2 === undefined) {
            this.promise = new Promise(arg1);
            this.parent = null;
        }
        else {
            this.promise = arg1;
            this.parent = arg2;
        }
        this.children = null;
        this.canceled = false;
    }
    get [Symbol.toStringTag]() {
        return "PromiseExt";
    }
    then(onFulfilled, onRejected) {
        var _a, _b;
        if (this.canceled)
            return this;
        const onFulfilledWrapper = (value) => this.canceled || onFulfilled(value);
        const onRejectedWrapper = onRejected ? (reason) => this.canceled || onRejected(reason) : undefined;
        const promise = this.promise.then(onFulfilledWrapper, onRejectedWrapper);
        const result = new PromiseExt(promise, this);
        (_b = (_a = this.children) === null || _a === void 0 ? void 0 : _a.push(result)) !== null && _b !== void 0 ? _b : (this.children = [result]);
        return result;
    }
    catch(onRejected) {
        var _a, _b;
        if (this.canceled)
            return this;
        const onRejectedWrapper = (reason) => this.canceled || onRejected(reason);
        const promise = this.promise.catch(onRejectedWrapper);
        const result = new PromiseExt(promise, this);
        (_b = (_a = this.children) === null || _a === void 0 ? void 0 : _a.push(result)) !== null && _b !== void 0 ? _b : (this.children = [result]);
        return result;
    }
    finally(onFinally) {
        var _a, _b;
        if (this.canceled)
            return this;
        const onFinallyWrapper = () => !this.canceled ? onFinally() : undefined;
        const promise = this.promise.finally(onFinallyWrapper);
        const result = new PromiseExt(promise, this);
        (_b = (_a = this.children) === null || _a === void 0 ? void 0 : _a.push(result)) !== null && _b !== void 0 ? _b : (this.children = [result]);
        return result;
    }
    timeout(delay, value) {
        var _a, _b, _c, _d;
        if (this.canceled)
            return this;
        if (value === undefined) {
            const onFinallyWrapper = () => new Promise(resolve => setTimeout(resolve, delay));
            const promise = this.promise.finally(onFinallyWrapper);
            const result = new PromiseExt(promise, this);
            (_b = (_a = this.children) === null || _a === void 0 ? void 0 : _a.push(result)) !== null && _b !== void 0 ? _b : (this.children = [result]);
            return result;
        }
        else {
            const onFulfilledWrapper = () => new Promise(resolve => setTimeout(resolve, delay, value));
            const promise = this.promise.then(onFulfilledWrapper);
            const result = new PromiseExt(promise, this);
            (_d = (_c = this.children) === null || _c === void 0 ? void 0 : _c.push(result)) !== null && _d !== void 0 ? _d : (this.children = [result]);
            return result;
        }
    }
    cancel(cancelParent = true) {
        var _a;
        this.canceled = true;
        if (this.children)
            for (const child of this.children)
                if (!child.canceled)
                    child.cancel(false);
        if (cancelParent)
            (_a = this.parent) === null || _a === void 0 ? void 0 : _a.cancel();
    }
    static wrap(promise) {
        return new PromiseExt(promise, null);
    }
    static resolve(value) {
        return new PromiseExt(Promise.resolve(value), null);
    }
    static reject(reason) {
        return new PromiseExt(Promise.reject(reason), null);
    }
    static all(values) {
        const promise = Promise.all(values).catch((reason) => {
            for (const value of values)
                if (value instanceof PromiseExt)
                    value.cancel();
            return Promise.reject(reason);
        });
        return new PromiseExt(promise, null);
    }
    static race(values) {
        const promise = Promise.race(values);
        return new PromiseExt(promise, null);
    }
    static allSettled(values) {
        const promise = Promise.allSettled(values);
        return new PromiseExt(promise, null);
    }
    static any(values) {
        const promise = Promise.any(values);
        return new PromiseExt(promise, null);
    }
}
exports.PromiseExt = PromiseExt;
exports.default = PromiseExt;
//# sourceMappingURL=index.js.map