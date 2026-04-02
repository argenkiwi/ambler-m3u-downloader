import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

export function saveM3UFile(
  onSuccess: Nextable<State>
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    if (!state.m3uFilePath) {
      throw new Error("M3U file path is not defined.");
    }

    const content = state.urls.join("\n");
    await Deno.writeTextFile(state.m3uFilePath, content);
    console.log(`Saved resolved URLs to ${state.m3uFilePath}`);
    return new Next(onSuccess, state);
  };
}
