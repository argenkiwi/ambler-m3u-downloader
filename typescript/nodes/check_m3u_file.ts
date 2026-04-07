import { Next, Nextable } from "../ambler.ts";

export interface CheckM3UFileState {
  m3uFilePath: string | null;
}

type CheckEdges<S> = { onRead: Nextable<S>; onPrompt: Nextable<S> };
type CheckUtils = { stat: (path: string) => Promise<Deno.FileInfo> };

const defaultUtils: CheckUtils = {
  stat: (path) => Deno.stat(path),
};

export function checkM3UFile<S extends CheckM3UFileState>(
  edges: CheckEdges<S>,
  utils: CheckUtils = defaultUtils
): Nextable<S> {
  return async (state: S): Promise<Next<S>> => {
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
