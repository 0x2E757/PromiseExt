# PromiseExt

PromiseExt is an extension of the native JavaScript `Promise` object, providing additional functionality for managing promise state and handling common use cases such as timeouts, cancellations, and state inspections. This package is designed specifically for TypeScript-based projects.

## Features

**Timeout:** Create promise that resolve after a specified delay.

**State Management:** Track the state of promise (pending, resolving, resolved, rejecting, rejected, canceled).

**Cancellation:** Cancel promise at any point.

**Resolve/Reject as properties:** Methods to resolve/reject promise at any point outside of executor (can be omitted).

## Installation

```bash
npm install promise-ext
```

## Examples

### Basic

```typescript
import { PromiseExt } from "promise-ext";

const promise = new PromiseExt((resolve) => {
  resolve("Hello, world!");
});

promise.then(console.log); // Output: "Hello, world!"
```

### Timeout

```typescript
import { PromiseExt } from "promise-ext";

const promise = PromiseExt.timeout(1000, "Hello, world!");

promise.then(console.log); // Output: "Hello, world!" after 1 second
```

### Creating and Managing Promises

```typescript
import { PromiseExt } from "promise-ext";

const promise = new PromiseExt<string>();

promise.then(console.log);
console.log(promise.state); // Output: "pending"

promise.resolve("Hello, world!"); // Output: "Hello, world!"
console.log(promise.state); // Output: "resolved"
```

### Canceling Promises

```typescript
import { PromiseExt } from "promise-ext";

const promise = new PromiseExt<string>((resolve, reject, cancel) => {
  setTimeout(resolve, 2000, "Success"); // Outputs warning that promise was canceled
});

promise.cancel();

console.log(promise.state); // Output: "canceled"
```

## API

#### Static Methods

`timeout<T>(delay?: number, value?: T): Promise<T>`: Creates a promise that resolves after the specified delay.

#### Instance Properties

`state: PromiseState` — The current state of the promise (pending, resolving, resolved, rejecting, rejected, canceled).

`resolve: (value: T) => void` — Wrapper for resolving the promise.

`reject: (reason: any) => void` — Wrapper for rejecting the promise.

`cancel: () => void` — Wrapper for canceling the promise.

`isPending: boolean` — Checks if the promise is pending.

`isResolved: boolean` — Checks if the promise is resolved.

`isRejected: boolean` — Checks if the promise is rejected.

`isCanceled: boolean` — Checks if the promise is canceled.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
