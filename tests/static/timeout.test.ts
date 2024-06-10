import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { PromiseExt } from "../../src/index.ts";

Deno.test("basic", async () => {
    const value = crypto.randomUUID();
    const peResult = await PromiseExt.timeout(0, value);
    assertEquals(peResult, value);
});

Deno.test("mixed resolved", async () => {
    const value = crypto.randomUUID();
    const peResult1 = await PromiseExt.timeout(0, Promise.resolve(value));
    const peResult2 = await PromiseExt.timeout(0, PromiseExt.resolve(value));
    assertEquals(peResult1, value);
    assertEquals(peResult2, value);
});
