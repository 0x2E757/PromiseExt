// Helper types
type AppendParameters<T, U extends unknown[]> = T extends (...args: infer A) => infer R
  ? (...args: [...A, ...U]) => R
  : never;
type OverrideTuple<T extends unknown[], U extends unknown[]> = keyof U extends keyof T
  ? { [K in keyof T]: K extends keyof U ? U[K] : T[K] }
  : U;

// Native promise types
export type PromiseArgs<T> = ConstructorParameters<typeof Promise<T>>;
export type Executor<T> = PromiseArgs<T>[0];
export type ExecutorArgs<T> = Parameters<Executor<T>>;
export type Resolve<T> = ExecutorArgs<T>[0];
export type ResolveArgs<T> = Parameters<Resolve<T>>;
export type Reject<T> = ExecutorArgs<T>[1];
export type RejectArgs<T> = Parameters<Reject<T>>;

// Extended promise types
export type ExecutorExt<T> = AppendParameters<Executor<T>, [cancel: () => void]>;
export type PromiseArgsExt<T> = OverrideTuple<PromiseArgs<T>, [ExecutorExt<T>]>;

export enum State {
  Pending = "pending",
  Resolving = "resolving",
  Resolved = "resolved",
  Rejecting = "rejecting",
  Rejected = "rejected",
  Canceled = "canceled",
}
