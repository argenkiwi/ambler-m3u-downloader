import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

type SaveEdges = { onSuccess: Nextable<State> };
type SaveUtils = { writeTextFile: (path: string, content: string) => Promise<void> };

const defaultUtils: SaveUtils = {
  writeTextFile: (path, content) => Deno.writeTextFile(path, content),
};

export function saveM3UFile(
  edges: SaveEdges,
  utils: SaveUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    if (!state.m3uFilePath) {
      throw new Error("M3U file path is not defined.");
    }

    const content = state.urls.join("\n");
    await utils.writeTextFile(state.m3uFilePath, content);
    console.log(`Saved resolved URLs to ${state.m3uFilePath}`);

    console.log(`\n--- URLs ---`);
    state.urls.forEach((url) => console.log(url));
    console.log("------------");

    return new Next(edges.onSuccess, state);
  };
}
