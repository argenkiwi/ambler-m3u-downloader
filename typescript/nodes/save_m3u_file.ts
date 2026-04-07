import { Next, Nextable } from "../ambler.ts";

export interface SaveM3UFileState {
  m3uFilePath: string | null;
  urls: string[];
}

type SaveEdges<S> = { onSuccess: Nextable<S> };
type SaveUtils = { writeTextFile: (path: string, content: string) => Promise<void> };

const defaultUtils: SaveUtils = {
  writeTextFile: (path, content) => Deno.writeTextFile(path, content),
};

export function saveM3UFile<S extends SaveM3UFileState>(
  edges: SaveEdges<S>,
  utils: SaveUtils = defaultUtils
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
