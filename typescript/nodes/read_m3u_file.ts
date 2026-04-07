import { Next, Nextable } from "../ambler.ts";

export namespace ReadM3UFile {
  export interface State {
    m3uFilePath: string | null;
    urls: string[];
  }

  export type Edges<S> = { onSuccess: Nextable<S> };
  export type Utils = { readTextFile: (path: string) => Promise<string> };

  const defaultUtils: Utils = {
    readTextFile: (path) => Deno.readTextFile(path),
  };

  export function create<S extends State>(
    edges: Edges<S>,
    utils: Utils = defaultUtils
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
}
