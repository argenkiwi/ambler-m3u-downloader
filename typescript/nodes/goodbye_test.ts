import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Goodbye } from "./goodbye.ts";

Deno.test("goodbye node logs gratitude and returns null", async () => {
  let loggedMessage = "";
  const mockUtils = {
    log: (message: string) => {
      loggedMessage = message;
    },
  };

  const node = Goodbye.create(mockUtils);
  const next = await node({});

  assertEquals(loggedMessage, "\nThank you for using the M3U Downloader! Have a great day!");
  assertEquals(next, null);
});
