import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

type PromptEdges = { onCheck: Nextable<State> };
type PromptUtils = { readLine: () => Promise<string> };

const defaultUtils: PromptUtils = {
  readLine: async () => {
    const line = await Deno.stdin.readable.getReader().read();
    return new TextDecoder().decode(line.value).trim();
  },
};

export function promptM3UFile(
  edges: PromptEdges,
  utils: PromptUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    console.log("Please enter the path to your M3U file:");
    const m3uFilePath = await utils.readLine();

    if (!m3uFilePath) {
      // Re-prompt if empty
      return new Next(promptM3UFile(edges, utils), state);
    }

    return new Next(edges.onCheck, { ...state, m3uFilePath });
  };
}
