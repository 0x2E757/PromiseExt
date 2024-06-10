import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { PromiseExt } from "../src/index.ts";

Deno.test("basic", async () => {
    const value = crypto.randomUUID();
    const p = Promise.withResolvers<typeof value>();
    const pe = new PromiseExt<typeof value>();
    p.resolve(value);
    pe.resolve(value);
    assertEquals(await p.promise, value);
    assertEquals(await pe, value);
});

Deno.test("nested", async () => {
    const value = crypto.randomUUID();
    const p = Promise.withResolvers<typeof value>();
    const pe = new PromiseExt<typeof value>();
    p.resolve(Promise.resolve(value));
    pe.resolve(PromiseExt.resolve(value));
    assertEquals(await p.promise, value);
    assertEquals(await pe, value);
});

Deno.test("mixed nested", async () => {
    const value = crypto.randomUUID();
    const p = Promise.withResolvers<typeof value>();
    const pe = new PromiseExt<typeof value>();
    p.resolve(PromiseExt.resolve(value));
    pe.resolve(Promise.resolve(value));
    assertEquals(await p.promise, value);
    assertEquals(await pe, value);
});
