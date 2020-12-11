# PromiseExt

Lightweight native promise wrapper that can be cancelled. Has no dependencies on other libraries.

TypeScript code transpiled to ES2018 JavaScript.

## Install

```bash
npm i @0x2e757/promise-ext
```

## Usage

New class `PromiseExt` mostly will by used same as regular ES2018 `Promise`.

### How to import

```typescript
import PromiseExt from "@0x2e757/promise-ext";
```
### Unique methods

`timeout` — wrapper around resolver using `setTimeout`;

`cancel` — function for preventing promise or its chain actions execution;

### Unique static functions

`wrap` — creates wrapper for provided promise;

<sub>\* `all` function will cancel all cancellable promises if any of them will fail.</sub>