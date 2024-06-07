export type Resolve<T> = (value: T | PromiseLike<T>) => void;
export type Reject = (reason?: unknown) => void;
export type Cancel = () => void;
export type PromiseExecutor<T> = (resolve: Resolve<T>, reject: Reject, cancel: Cancel) => void;
export type Logger = (text: string) => void;
