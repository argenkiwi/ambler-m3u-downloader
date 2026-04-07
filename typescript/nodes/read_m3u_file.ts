import { Next, Nextable } from "../ambler.ts";

export interface ReadM3UFileState {
  m3uFilePath: string | null;
  urls: string[];
}

type ReadEdges<S> = { onSuccess: Nextable<S> };
type ReadUtils = { readTextFile: (path: string) => Promise<string> };

const defaultUtils: ReadUtils = {
  readTextFile: (path) => Deno.readTextFile(path),
};

export function readM3UFile<S extends ReadM3UFileState>(
  edges: ReadEdges<S>,
  utils: ReadUtils = defaultUtils
): Nextable<S> {
  return async (state: S): Promise<Next<S>> => {
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
