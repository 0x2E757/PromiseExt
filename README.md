# PromiseExt

Custom promise implementation with an advanced functionality and native promise compatibility. Has no dependecies on other libraries.

## Install

```bash
npm i @0x2E757/PromiseExt
```

## Usage

New class `PromiseExt` mostly will by used same as regular `Promise`.

### How to import

```typescript
import PromiseExt from "@0x2e757/promise-ext";
```

### Class object's public properties

`state` — scheduled = 0, running = 1, finished = 2, canceled = 3;

`isScheduled` — getter that will return true if state equals 0, otherwise false;

`isRunning` — getter that will return true if state equals 1, otherwise false;

`isFinished` — getter that will return true if state equals 2, otherwise false;

`isCanceled` — getter that will return true if state equals 3, otherwise false;

<sub>\* scheduled means that promise isn't started yet, running means that promise has started and some of chain actions is in progress or scheduled.</sub>

### Class object's public methods

`then` — same functionality as per regular promise;

`catch` — same functionality as per regular promise;

`finally` — new method that can be used to prevent some clean-ups or process finalizing code duplication in then and catch; 

`cancel` — new method for preventing promise or its chain actions execution;

### Class static public methods

`all` — basically same functionality as per regular promise `all` method, but can accept object with promises and will try to cancel promises if any of them will fail;

`race` — basically same functionality as per regular promise `race` method, but will try to cancel promises if any of them will fail;