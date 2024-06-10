import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { PromiseExt } from "../../src/index.ts";

Deno.test("basic", async () => {
    const value = crypto.randomUUID();
    const pResult = await Promise.resolve(value);
    const peResult = await PromiseExt.resolve(value);
    assertEquals(pResult, value);
    assertEquals(peResult, value);
});

Deno.test("nested", async () => {
    const value = crypto.randomUUID();
    const pResult = await Promise.resolve(Promise.resolve(value));
    const peResult = await PromiseExt.resolve(PromiseExt.resolve(value));
    assertEquals(pResult, value);
    assertEquals(peResult, value);
});

Deno.test("mixed nested", async () => {
    const value = crypto.randomUUID();
    const result1 = await Promise.resolve(PromiseExt.resolve(value));
    const result2 = await PromiseExt.resolve(Promise.resolve(value));
    assertEquals(result1, value);
    assertEquals(result2, value);
});
