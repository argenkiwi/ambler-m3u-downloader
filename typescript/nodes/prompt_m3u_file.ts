import { Next, Nextable } from "../ambler.ts";

export interface PromptM3UFileState {
  m3uFilePath: string | null;
}

type PromptEdges<S> = { onCheck: Nextable<S> };
type PromptUtils = { readLine: () => Promise<string> };

const defaultUtils: PromptUtils = {
  readLine: async () => {
    const line = await Deno.stdin.readable.getReader().read();
    return new TextDecoder().decode(line.value).trim();
  },
};

export function promptM3UFile<S extends PromptM3UFileState>(
  edges: PromptEdges<S>,
  utils: PromptUtils = defaultUtils
): Nextable<S> {
  return async (state: S): Promise<Next<S>> => {
    console.log("Please enter the path to your M3U file:");
    const m3uFilePath = await utils.readLine();

    if (!m3uFilePath) {
      // Re-prompt if empty
      return new Next(promptM3UFile(edges, utils), state);
    }

    return new Next(edges.onCheck, { ...state, m3uFilePath });
  };
}
