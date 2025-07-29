import { Node, State } from "../nodes.ts";

export async function saveM3UFile(state: State): Promise<[State, Node]> {
  if (!state.m3uFilePath) {
    throw new Error("M3U file path is not defined.");
  }

  const content = state.urls.join("\n");
  await Deno.writeTextFile(state.m3uFilePath, content);
  console.log(`Saved resolved URLs to ${state.m3uFilePath}`);
  return [state, Node.PROMPT_OPTIONS];
}
