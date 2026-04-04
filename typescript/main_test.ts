import { amble, lazy, Next, Nextable } from "./ambler.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("amble function works correctly", async () => {
  let callCount = 0;
  
  const stop: Nextable<number> = async (state: number) => {
    callCount++;
    return null;
  };

  const step: Nextable<number> = async (state: number) => {
    callCount++;
    if (state < 3) {
      return new Next(step, state + 1);
    }
    return new Next(stop, state);
  };

  const start: Nextable<number> = async (state: number) => {
    callCount++;
    return new Next(step, state + 1);
  };

  await amble(start, 0);

  // start (0->1) -> step (1->2) -> step (2->3) -> step (3->3) -> stop
  assertEquals(callCount, 5);
});

Deno.test("lazy defers node resolution to call time", async () => {
  // Declare the lazy reference before the target is assigned
  const lazyTarget = lazy<number>(() => target);

  let visited = false;
  const target: Nextable<number> = async (_state: number) => {
    visited = true;
    return null;
  };

  await lazyTarget(0);
  assertEquals(visited, true);
});
