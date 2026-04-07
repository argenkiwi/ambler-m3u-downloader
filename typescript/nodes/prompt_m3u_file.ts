import { Next, Nextable } from "../ambler.ts";

export namespace PromptM3UFile {
  export interface State {
    m3uFilePath: string | null;
  }

  export type Edges<S> = { onCheck: Nextable<S> };
  export type Utils = { readLine: () => Promise<string> };

  const defaultUtils: Utils = {
    readLine: async () => {
      const line = await Deno.stdin.readable.getReader().read();
      return new TextDecoder().decode(line.value).trim();
    },
  };

  export function create<S extends State>(
    edges: Edges<S>,
    utils: Utils = defaultUtils
  ): Nextable<S> {
    return async (state: S): Promise<Next<S>> => {
      console.log("Please enter the path to your M3U file:");
      const m3uFilePath = await utils.readLine();

      if (!m3uFilePath) {
        // Re-prompt if empty
        return new Next(PromptM3UFile.create(edges, utils), state);
      }

      return new Next(edges.onCheck, { ...state, m3uFilePath });
    };
  }
}
