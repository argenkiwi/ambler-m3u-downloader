import { Next } from "../ambler.ts";
import { State } from "../state.ts";
import { checkM3UFile } from "./check_m3u_file.ts";

export async function promptM3UFile(state: State): Promise<Next<State>> {
  console.log("Please enter the path to your M3U file:");
  const line = await Deno.stdin.readable.getReader().read();
  const m3uFilePath = new TextDecoder().decode(line.value).trim();

  if (!m3uFilePath) {
    return new Next(promptM3UFile, state);
  }

  return new Next(checkM3UFile, { ...state, m3uFilePath });
}
