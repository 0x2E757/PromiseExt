# PromiseExt

Custom promise implementation with an advanced functionality and native promise compatibility. Has no dependecies on other libraries.

TypeScript code transpiled to ES3 JavaScript.

## Install

```bash
npm i @0x2e757/promise-ext
```

## Usage

New class `PromiseExt` mostly will by used same as regular `Promise`.

### How to import

```typescript
import PromiseExt from "@0x2e757/promise-ext";
```

### Class object's public properties

`state` — scheduled = 0, running = 1, finished = 2, canceled = 3;

<sub>\* scheduled means that promise isn't started yet, running means that promise has started and one of chain actions is in progress or scheduled.</sub>

### Class object's public methods

`then` — same functionality as per regular promise;

`catch` — same functionality as per regular promise;

`finally` — new method that can be used to prevent some clean-ups or process finalizing code duplication in then and catch; 

`cancel` — new method for preventing promise or its chain actions execution;

`isScheduled` — will return true if state equals 0, otherwise false;

`isRunning` — will return true if state equals 1, otherwise false;

`isFinished` — will return true if state equals 2, otherwise false;

`isCanceled` — will return true if state equals 3, otherwise false;

### Class static public methods

`all` — basically same functionality as per regular promise `all` method, but can accept object with promises and will try to cancel promises if any of them will fail;

`race` — basically same functionality as per regular promise `race` method, but will try to cancel promises if any of them will fail;

`wrap` — can be used to wrap regular promise into PromiseExt;