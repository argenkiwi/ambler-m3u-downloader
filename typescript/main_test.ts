import { amble } from "./ambler.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("amble function works correctly", async () => {
  let callCount = 0;
  const dummyStep = async (
    state: number,
    node: string,
  ): Promise<[number, string | null]> => {
    callCount++;
    if (node === "START") {
      return [state + 1, "MIDDLE"];
    } else if (node === "MIDDLE") {
      return [state + 1, "END"];
    } else if (node === "END") {
      return [state + 1, null];
    }
    return [state, null];
  };

  const [finalState, finalNode] = await amble(0, "START", dummyStep);

  assertEquals(finalState, 3);
  assertEquals(finalNode, null);
  assertEquals(callCount, 3);
});
