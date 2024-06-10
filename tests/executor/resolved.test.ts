import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { PromiseExt } from "../../src/index.ts";

Deno.test("basic", async () => {
    const value = crypto.randomUUID();
    const pResult = await new Promise<typeof value>((resolve) => resolve(value));
    const peResult = await new PromiseExt<typeof value>((resolve) => resolve(value));
    assertEquals(pResult, value);
    assertEquals(peResult, value);
});


Deno.test("nested", async () => {
    const value = crypto.randomUUID();
    const pResult = await new Promise<typeof value>((resolve) => resolve(Promise.resolve(value)));
    const peResult = await new PromiseExt<typeof value>((resolve) => resolve(PromiseExt.resolve(value)));
    assertEquals(pResult, value);
    assertEquals(peResult, value);
});


Deno.test("mixed nested", async () => {
    const value = crypto.randomUUID();
    const pResult = await new Promise<typeof value>((resolve) => resolve(PromiseExt.resolve(value)));
    const peResult = await new PromiseExt<typeof value>((resolve) => resolve(Promise.resolve(value)));
    assertEquals(pResult, value);
    assertEquals(peResult, value);
});
