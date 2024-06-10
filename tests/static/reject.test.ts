import { assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { PromiseExt } from "../../src/index.ts";

Deno.test("basic", async () => {
    const value = crypto.randomUUID();
    await assertRejects(() => Promise.reject(value), value);
    await assertRejects(() => PromiseExt.reject(value), value);
});

Deno.test("resolved", async () => {
    const value = crypto.randomUUID();
    await assertRejects(() => Promise.resolve(Promise.reject(value)), value);
    await assertRejects(() => Promise.resolve(PromiseExt.reject(value)), value);
    await assertRejects(() => PromiseExt.resolve(Promise.reject(value)), value);
    await assertRejects(() => PromiseExt.resolve(PromiseExt.reject(value)), value);
});
