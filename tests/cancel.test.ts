import { delay } from "https://deno.land/x/delay@v0.2.0/mod.ts";
import { PromiseExt } from "../src/index.ts";

Deno.test("basic", async () => {
    const pe = PromiseExt.timeout(0);
    pe.then(() => { throw new Error("This should never be thrown") });
    pe.cancel();
    await delay(0);
});
