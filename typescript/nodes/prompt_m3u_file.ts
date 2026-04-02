import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

export function promptM3UFile(
  onCheck: Nextable<State>
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    console.log("Please enter the path to your M3U file:");
    const line = await Deno.stdin.readable.getReader().read();
    const m3uFilePath = new TextDecoder().decode(line.value).trim();

    if (!m3uFilePath) {
      // Re-prompt if empty
      return new Next(promptM3UFile(onCheck), state);
    }

    return new Next(onCheck, { ...state, m3uFilePath });
  };
}
