import { Node, State } from "../nodes.ts";
import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

export async function checkM3UFile(state: State): Promise<[State, Node]> {
  let m3uFilePath = Deno.args[0];

  while (true) {
    if (m3uFilePath) {
      try {
        const fileInfo = await Deno.stat(m3uFilePath);
        if (fileInfo.isFile && m3uFilePath.endsWith(".m3u")) {
          console.log(`Using M3U file: ${m3uFilePath}`);
          return [{ ...state, m3uFilePath }, Node.READ_M3U_FILE];
        }
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          console.log(`File not found: ${m3uFilePath}`);
        } else {
          console.log(`Error accessing file: ${error.message}`);
        }
      }
    }

    console.log("Please enter the path to your M3U file:");
    for await (const line of readLines(Deno.stdin)) {
      m3uFilePath = line.trim();
      break;
    }
  }
}
