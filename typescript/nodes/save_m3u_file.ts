import { Next, Nextable } from "../ambler.ts";

export namespace SaveM3UFile {
  export interface State {
    m3uFilePath: string | null;
    urls: string[];
  }

  export type Edges<S> = { onSuccess: Nextable<S> };
  export type Utils = { writeTextFile: (path: string, content: string) => Promise<void> };

  const defaultUtils: Utils = {
    writeTextFile: (path, content) => Deno.writeTextFile(path, content),
  };

  export function create<S extends State>(
    edges: Edges<S>,
    utils: Utils = defaultUtils
  ): Nextable<S> {
    return async (state: S): Promise<Next<S>> => {
      if (!state.m3uFilePath) {
        throw new Error("M3U file path is not defined.");
      }

      const content = state.urls.join("\n");
      await utils.writeTextFile(state.m3uFilePath, content);
      console.log(`Saved resolved URLs to ${state.m3uFilePath}`);
      return new Next(edges.onSuccess, state);
    };
  }
}
