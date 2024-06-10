import { assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { PromiseExt } from "../../src/index.ts";

Deno.test("basic", async () => {
    const value = crypto.randomUUID();
    await assertRejects(() => new Promise<typeof value>((_resolve, reject) => reject(value)), value);
    await assertRejects(() => new PromiseExt<typeof value>((_resolve, reject) => reject(value)), value);
});

Deno.test("resolved", async () => {
    const value = crypto.randomUUID();
    await assertRejects(() => Promise.resolve(new Promise<typeof value>((_resolve, reject) => reject(value))), value);
    await assertRejects(() => Promise.resolve(new PromiseExt<typeof value>((_resolve, reject) => reject(value))), value);
    await assertRejects(() => PromiseExt.resolve(new Promise<typeof value>((_resolve, reject) => reject(value))), value);
    await assertRejects(() => PromiseExt.resolve(new PromiseExt<typeof value>((_resolve, reject) => reject(value))), value);
});
