import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";
import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

type DownloadEdges = { onDownload: Nextable<State> };
type DownloadUtils = { readLine: () => Promise<string> };

const defaultUtils: DownloadUtils = {
  readLine: async () => {
    for await (const line of readLines(Deno.stdin)) {
      return line;
    }
    return "";
  },
};

export function promptDownload(
  edges: DownloadEdges,
  utils: DownloadUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State> | null> => {
    while (true) {
      console.log("\nProceed with download? (y/n)");
      const line = (await utils.readLine()).trim().toLowerCase();
      if (line === "y" || line === "yes") return new Next(edges.onDownload, state);
      if (line === "n" || line === "no") return null;
    }
  };
}
