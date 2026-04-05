import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";
import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

type ResolveEdges = { onResolve: Nextable<State> };
type ResolveUtils = { readLine: () => Promise<string> };

const defaultUtils: ResolveUtils = {
  readLine: async () => {
    for await (const line of readLines(Deno.stdin)) {
      return line;
    }
    return "";
  },
};

export function promptResolve(
  edges: ResolveEdges,
  utils: ResolveUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State> | null> => {
    while (true) {
      console.log("\nSome URLs require resolution. Proceed? (y/n)");
      const line = (await utils.readLine()).trim().toLowerCase();
      if (line === "y" || line === "yes") return new Next(edges.onResolve, state);
      if (line === "n" || line === "no") return null;
    }
  };
}
