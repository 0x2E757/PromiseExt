# PromiseExt

Extension of the native JavaScript `Promise` class, providing additional functionality for managing promise state and handling common use cases such as timeouts, cancellations, and state inspections. This package is designed specifically for TypeScript-based projects.

The `PromiseExt` class handles the native promise as a private property instead of extending the `Promise` class. This approach prevents issues that can arise from third-party library manipulations with the native `Promise` class and its methods.

Code must target ES2021 (or include the lib) or newer because of `Promise.any` method.

## Features

**Timeout:** Create promise that resolve after a specified delay.

**State Management:** Track the state of promise (`pending`, `resolved`, `rejected` or `canceled`).

**Cancellation:** Cancel promise at any point.

**Resolve/Reject as properties:** Methods to resolve/reject promise at any point outside of executor (can be omitted).

## Installation

### Node.js

```bash
npm install @0x2e757/promise-ext
```

```typescript
import { PromiseExt } from "@0x2e757/promise-ext";
```

### Deno

```bash
deno add @0x2e757/promise-ext
```

```typescript
import { PromiseExt } from "@0x2e757/promise-ext";
```

or

```typescript
import { PromiseExt } from "jsr:@0x2e757/promise-ext";
```

## Examples

### Basic

```typescript
import { PromiseExt } from "@0x2e757/promise-ext";

const promise = new PromiseExt((resolve) => {
  resolve("Hello, world!");
});

promise.then(console.log); // Output: "Hello, world!"
```

### Timeout

```typescript
import { PromiseExt } from "@0x2e757/promise-ext";

const promise = PromiseExt.timeout(1000, "Hello, world!");

promise.then(console.log); // Output: "Hello, world!" after 1 second
```

### Creating and Managing Promises

```typescript
import { PromiseExt } from "@0x2e757/promise-ext";

const promise = new PromiseExt<string>();

promise.then(console.log);
console.log(promise.state); // Output: "pending"

promise.resolve("Hello, world!"); // Output: "Hello, world!"
console.log(promise.state); // Output: "resolved"
```

### Canceling Promises

```typescript
import { PromiseExt } from "@0x2e757/promise-ext";

const promise = new PromiseExt<string>((resolve, reject, cancel) => {
  setTimeout(resolve, 2000, "Success"); // Outputs warning that promise was canceled
});

promise.cancel();

console.log(promise.state); // Output: "canceled"
```

## API

#### Static Properties

`static logger?: Logger` - Logger function for logging warnings. Set to `undefined` to suppress warnings. Uses `console.warn` by default.

#### Static Methods

`timeout<T>(delay?: number, value?: T): PromiseExt<T>` - Creates a promise that resolves after the specified delay.

#### Instance Properties

`state: PromiseState` — The current state of the promise (`pending`, `resolved`, `rejected` or `canceled`).

`resolve: (value: T) => void` — Wrapper for resolving the promise.

`reject: (reason: any) => void` — Wrapper for rejecting the promise.

`cancel: () => void` — Wrapper for canceling the promise.

`isPending: boolean` — Checks if the promise is pending.

`isResolved: boolean` — Checks if the promise is resolved.

`isRejected: boolean` — Checks if the promise is rejected.

`isCanceled: boolean` — Checks if the promise is canceled.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
