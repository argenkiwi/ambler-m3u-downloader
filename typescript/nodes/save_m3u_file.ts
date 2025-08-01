import { Next } from "../ambler.ts";
import { State } from "../state.ts";
import { promptOptions } from "./prompt_options.ts";

export async function saveM3UFile(state: State): Promise<Next<State>> {
  if (!state.m3uFilePath) {
    throw new Error("M3U file path is not defined.");
  }

  const content = state.urls.join("\n");
  await Deno.writeTextFile(state.m3uFilePath, content);
  console.log(`Saved resolved URLs to ${state.m3uFilePath}`);
  return new Next(promptOptions, state);
}
