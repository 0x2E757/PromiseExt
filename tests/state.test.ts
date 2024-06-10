import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { PromiseExt, PromiseState } from "../src/index.ts";

Deno.test("pending", () => {
    const pe = new PromiseExt();
    assertEquals(pe.state, PromiseState.Pending);
});

Deno.test("resolved", () => {
    const pe = new PromiseExt();
    assertEquals(pe.state, PromiseState.Pending);
    pe.resolve(undefined);
    assertEquals(pe.state, PromiseState.Resolved);
});

Deno.test("rejected", () => {
    const pe = new PromiseExt();
    assertEquals(pe.state, PromiseState.Pending);
    pe.reject(undefined);
    pe.catch(() => { });
    assertEquals(pe.state, PromiseState.Rejected);
});

Deno.test("canceled", () => {
    const pe = new PromiseExt();
    assertEquals(pe.state, PromiseState.Pending);
    pe.cancel();
    assertEquals(pe.state, PromiseState.Canceled);
});
