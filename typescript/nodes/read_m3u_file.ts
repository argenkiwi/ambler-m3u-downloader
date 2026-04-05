import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

type ReadEdges = { onResolve: Nextable<State>; onDownload: Nextable<State> };
type ReadUtils = { readTextFile: (path: string) => Promise<string> };

const defaultUtils: ReadUtils = {
  readTextFile: (path) => Deno.readTextFile(path),
};

export function readM3UFile(
  edges: ReadEdges,
  utils: ReadUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    if (!state.m3uFilePath) {
      throw new Error("M3U file path is not defined.");
    }

    const content = await utils.readTextFile(state.m3uFilePath);
    const urls = content.split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));

    console.log(`\n--- URLs ---`);
    urls.forEach((url) => console.log(url));
    console.log("------------");

    const nextState = { ...state, urls };
    const hasKhinsiderUrls = urls.some((url) =>
      url.startsWith("https://downloads.khinsider.com/game-soundtracks")
    );

    return new Next(hasKhinsiderUrls ? edges.onResolve : edges.onDownload, nextState);
  };
}
