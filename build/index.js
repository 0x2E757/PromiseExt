"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
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
var isPromiseLike = function (value) { return typeof value === "object" && typeof value.then === "function"; };
var allArray = function (values) {
    var results = [];
    var done = [];
    return new PromiseExt(function (resolve, reject) {
        var resolveWrapper = function (index) { return function (value) {
            results[index] = value;
            done[index] = true;
            for (var n = 0; n < done.length; n++)
                if (done[n] === false)
                    return;
            resolve(results);
        }; };
        var rejectWrapper = function (index) { return function (avalue) {
            for (var n = 0; n < values.length; n++) {
                var value = values[n];
                if (n !== index && done[n] !== false) {
                    if (value instanceof PromiseExt || typeof value.cancel === "function") {
                        value.cancel();
                    }
                }
            }
            reject(avalue);
        }; };
        for (var n = 0; n < values.length; n++) {
            var value = values[n];
            var isPromiseExtOrPromiseLike = value instanceof PromiseExt || isPromiseLike(value);
            if (isPromiseExtOrPromiseLike) {
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
var allObject = function (values) {
    var results = {};
    var done = {};
    return new PromiseExt(function (resolve, reject) {
        var resolveWrapper = function (akey) { return function (value) {
            results[akey] = value;
            done[akey] = true;
            for (var key in values)
                if (done[key] === false)
                    return;
            resolve(results);
        }; };
        var rejectWrapper = function (akey) { return function (avalue) {
            for (var key in values) {
                var value = values[key];
                if (key !== akey && done[akey] !== false) {
                    if (value instanceof PromiseExt || typeof value.cancel === "function") {
                        value.cancel();
                    }
                }
            }
            reject(avalue);
        }; };
        for (var key in values) {
            var value = values[key];
            var isPromiseExtOrPromiseLike = value instanceof PromiseExt || isPromiseLike(value);
            if (isPromiseExtOrPromiseLike) {
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
var race = function (values) {
    var cancelablePromises = [];
    var resolved = false;
    return new PromiseExt(function (resolve, reject) {
        var resolveWrapper = function (value) {
            if (resolved)
                return;
            for (var _i = 0, cancelablePromises_1 = cancelablePromises; _i < cancelablePromises_1.length; _i++) {
                var promise = cancelablePromises_1[_i];
                if (value instanceof PromiseExt || typeof value.cancel === "function") {
                    promise.cancel();
                }
            }
            resolve(value);
            resolved = true;
        };
        var rejectWrapper = function (index) { return function (avalue) {
            if (resolved)
                return;
            for (var n = 0; n < values.length; n++) {
                var value = values[n];
                if (n !== index && (value instanceof PromiseExt || typeof value.cancel === "function")) {
                    value.cancel();
                }
            }
            reject(avalue);
        }; };
        for (var n = 0; n < values.length; n++) {
            var value = values[n];
            var isPromiseExtOrPromiseLike = value instanceof PromiseExt || isPromiseLike(value);
            if (isPromiseExtOrPromiseLike) {
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
var wrap = function (promise, parameters) {
    return new PromiseExt(function (resolve, reject) { return promise.then(resolve, reject); }, parameters);
};
var PromiseExt = /** @class */ (function () {
    function PromiseExt(initialAction, parameters) {
        var _this = this;
        this.state = State.Scheduled;
        this.actions = [];
        this.index = 0;
        this.parent = null;
        this.exceptionTimeoutHandler = 0;
        this.resolve = function (value) {
            _this.result = value;
            _this.hasError = false;
            _this.exec();
        };
        this.reject = function (value) {
            _this.result = value;
            _this.hasError = true;
            _this.exec();
        };
        this.deferStart = function () {
            if (_this.params.useSetImmediate) {
                setImmediate(_this.start);
            }
            else {
                setTimeout(_this.start);
            }
        };
        this.start = function () {
            if (_this.state === State.Scheduled) {
                _this.state = State.Running;
                try {
                    _this.initialAction(_this.resolve, _this.reject);
                }
                catch (error) {
                    _this.reject(error);
                }
            }
        };
        this.onThen = function (action) {
            if (_this.hasError === false) {
                try {
                    _this.result = action(_this.result);
                    _this.hasError = false;
                }
                catch (error) {
                    _this.result = error;
                    _this.hasError = true;
                }
            }
        };
        this.onCatch = function (action) {
            if (_this.hasError === true) {
                try {
                    _this.result = action(_this.result);
                    _this.hasError = false;
                }
                catch (error) {
                    _this.result = error;
                    _this.hasError = true;
                }
            }
        };
        this.onFinally = function (action) {
            try {
                action(undefined);
            }
            catch (error) {
                _this.result = error;
                _this.hasError = true;
            }
        };
        this.onExceptionGenerator = function (error, index) { return function () {
            if (index === _this.actions.length) {
                PromiseExt.onUnhandledRejection(error);
            }
        }; };
        this.execRunAction = function (actionsItem) {
            switch (actionsItem.type) {
                case ActionType.Resolver: return _this.onThen(actionsItem.action);
                case ActionType.Rejector: return _this.onCatch(actionsItem.action);
                case ActionType.Finalizer: return _this.onFinally(actionsItem.action);
            }
        };
        this.execHandleResult = function () {
            if (_this.result instanceof PromiseExt) {
                var resolver = _this.hasError ? _this.reject : _this.resolve;
                _this.result.then(resolver, _this.reject).parent = _this;
                return true;
            }
            if (isPromiseLike(_this.result)) {
                var resolver = _this.hasError ? _this.reject : _this.resolve;
                _this.result.then(resolver, _this.reject);
                return true;
            }
            if (_this.params.deferdActions) {
                _this.params.useSetImmediate ? setImmediate(_this.exec) : setTimeout(_this.exec);
                return true;
            }
            return false;
        };
        this.exec = function () {
            if (_this.state === State.Canceled)
                return;
            _this.state = State.Running;
            while (_this.index < _this.actions.length) {
                _this.execRunAction(_this.actions[_this.index++]);
                if (_this.execHandleResult())
                    return;
            }
            if (_this.state === State.Running) {
                _this.state = State.Finished;
                if (_this.hasError && _this.parent === null) {
                    if (_this.exceptionTimeoutHandler)
                        clearTimeout(_this.exceptionTimeoutHandler);
                    var onException = _this.onExceptionGenerator(_this.result, _this.index);
                    _this.exceptionTimeoutHandler = setTimeout(onException);
                }
            }
        };
        this.addAction = function (action, type) {
            _this.actions.push({ action: action, type: type });
            if (_this.state === State.Finished)
                _this.exec();
        };
        this.then = function (action, rejector) {
            _this.addAction(action, ActionType.Resolver);
            return rejector ? _this["catch"](rejector) : _this;
        };
        this["catch"] = function (action, rejector) {
            _this.addAction(action, ActionType.Rejector);
            return rejector ? _this["catch"](rejector) : _this;
        };
        this["finally"] = function (action, rejector) {
            _this.addAction(action, ActionType.Finalizer);
            return rejector ? _this["catch"](rejector) : _this;
        };
        this.params = __assign({ deferStart: false, deferdActions: false, useSetImmediate: false }, parameters);
        this.initialAction = initialAction;
        this.params.deferStart ? this.deferStart() : this.start();
    }
    PromiseExt.onUnhandledRejection = function (error) { return console.error("Unhandled promise rejection", error); };
    PromiseExt.all = function (values) { return Array.isArray(values) ? allArray(values) : allObject(values); };
    PromiseExt.race = race;
    PromiseExt.wrap = wrap;
    return PromiseExt;
}());
exports.PromiseExt = PromiseExt;
PromiseExt.prototype.isScheduled = function () { return this.state === State.Scheduled; };
PromiseExt.prototype.isRunning = function () { return this.state === State.Running; };
PromiseExt.prototype.isFinished = function () { return this.state === State.Finished; };
PromiseExt.prototype.isCanceled = function () { return this.state === State.Canceled; };
PromiseExt.prototype.cancel = function () { this.state = State.Canceled; };
exports["default"] = PromiseExt;
//# sourceMappingURL=index.js.map