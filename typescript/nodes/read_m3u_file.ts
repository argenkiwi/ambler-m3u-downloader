import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

type ReadEdges = { onSuccess: Nextable<State> };
type ReadUtils = { readTextFile: (path: string) => Promise<string> };

const defaultUtils: ReadUtils = {
  readTextFile: (path) => Deno.readTextFile(path),
};

export function readM3UFile(
  edges: ReadEdges,
  utils: ReadUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    if (!state.m3uFilePath) {
      throw new Error("M3U file path is not defined.");
    }

    const content = await utils.readTextFile(state.m3uFilePath);
    const urls = content.split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));

    console.log(`Found ${urls.length} URLs in ${state.m3uFilePath}`);
    return new Next(edges.onSuccess, { ...state, urls });
  };
}
