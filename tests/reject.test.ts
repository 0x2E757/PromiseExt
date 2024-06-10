import { assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { PromiseExt } from "../src/index.ts";

Deno.test("basic", async () => {
    const value = crypto.randomUUID();
    const p = Promise.withResolvers<typeof value>();
    const pe = new PromiseExt<typeof value>();
    p.reject(value);
    pe.reject(value);
    await assertRejects(() => p.promise, value);
    await assertRejects(() => pe, value);
});

Deno.test("nested", async () => {
    const value = crypto.randomUUID();
    const p = Promise.withResolvers<typeof value>();
    const pe = new PromiseExt<typeof value>();
    p.reject(Promise.resolve(value));
    pe.reject(PromiseExt.resolve(value));
    await assertRejects(() => p.promise, value);
    await assertRejects(() => pe, value);
});

Deno.test("mixed nested", async () => {
    const value = crypto.randomUUID();
    const p = Promise.withResolvers<typeof value>();
    const pe = new PromiseExt<typeof value>();
    p.reject(PromiseExt.resolve(value));
    pe.reject(Promise.resolve(value));
    await assertRejects(() => p.promise, value);
    await assertRejects(() => pe, value);
});
