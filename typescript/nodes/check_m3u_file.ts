import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

type CheckEdges = { onRead: Nextable<State>; onPrompt: Nextable<State> };
type CheckUtils = { stat: (path: string) => Promise<Deno.FileInfo> };

const defaultUtils: CheckUtils = {
  stat: (path) => Deno.stat(path),
};

export function checkM3UFile(
  edges: CheckEdges,
  utils: CheckUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    const { m3uFilePath } = state;

    if (m3uFilePath) {
      try {
        const fileInfo = await utils.stat(m3uFilePath);
        if (fileInfo.isFile && m3uFilePath.endsWith(".m3u")) {
          return new Next(edges.onRead, state);
        }
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          console.log(`File not found: ${m3uFilePath}`);
        } else {
          console.log(`Error accessing file: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    return new Next(edges.onPrompt, state);
  };
}
