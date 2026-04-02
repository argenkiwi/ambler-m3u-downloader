import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

export function readM3UFile(
  onSuccess: Nextable<State>
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    if (!state.m3uFilePath) {
      throw new Error("M3U file path is not defined.");
    }

    const content = await Deno.readTextFile(state.m3uFilePath);
    const urls = content.split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));

    console.log(`Found ${urls.length} URLs in ${state.m3uFilePath}`);
    return new Next(onSuccess, { ...state, urls });
  };
}
