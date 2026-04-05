import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

type CheckEdges = { onRead: Nextable<State> };
type CheckUtils = { stat: (path: string) => Promise<Deno.FileInfo> };

const defaultUtils: CheckUtils = {
  stat: (path) => Deno.stat(path),
};

export function checkM3UFile(
  edges: CheckEdges,
  utils: CheckUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State> | null> => {
    const { m3uFilePath } = state;

    if (!m3uFilePath) {
      console.error("Error: Please provide the path to an M3U file as a command line argument.");
      return null;
    }

    try {
      const fileInfo = await utils.stat(m3uFilePath);
      if (fileInfo.isFile && m3uFilePath.endsWith(".m3u")) {
        return new Next(edges.onRead, state);
      }
      console.error(`Error: Not a valid M3U file: ${m3uFilePath}`);
      return null;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.error(`Error: File not found: ${m3uFilePath}`);
      } else {
        console.error(`Error accessing file: ${error instanceof Error ? error.message : String(error)}`);
      }
      return null;
    }
  };
}
