import { Next } from "../ambler.ts";
import { State } from "../state.ts";
import { readM3UFile } from "./read_m3u_file.ts";
import { promptM3UFile } from "./prompt_m3u_file.ts";

export async function checkM3UFile(state: State): Promise<Next<State>> {
  const { m3uFilePath } = state;

  if (m3uFilePath) {
    try {
      const fileInfo = await Deno.stat(m3uFilePath);
      if (fileInfo.isFile && m3uFilePath.endsWith(".m3u")) {
        return new Next(readM3UFile, state);
      } 
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.log(`File not found: ${m3uFilePath}`);
      } else {
        console.log(`Error accessing file: ${error.message}`);
      }
    }
  }

  return new Next(promptM3UFile, state);
}
