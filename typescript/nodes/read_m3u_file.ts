import { Node, State } from "../nodes.ts";

export async function readM3UFile(state: State): Promise<[State, Node]> {
  if (!state.m3uFilePath) {
    throw new Error("M3U file path is not defined.");
  }

  const content = await Deno.readTextFile(state.m3uFilePath);
  const urls = content.split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  console.log(`Found ${urls.length} URLs in ${state.m3uFilePath}`);
  return [{ ...state, urls }, Node.PROMPT_OPTIONS];
}
