import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

export function checkM3UFile(
  onRead: Nextable<State>,
  onPrompt: Nextable<State>
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    const { m3uFilePath } = state;

    if (m3uFilePath) {
      try {
        const fileInfo = await Deno.stat(m3uFilePath);
        if (fileInfo.isFile && m3uFilePath.endsWith(".m3u")) {
          return new Next(onRead, state);
        }
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          console.log(`File not found: ${m3uFilePath}`);
        } else {
          console.log(`Error accessing file: ${error.message}`);
        }
      }
    }

    return new Next(onPrompt, state);
  };
}
