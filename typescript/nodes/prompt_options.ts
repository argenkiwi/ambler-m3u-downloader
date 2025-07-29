import { Node, State } from "../nodes.ts";
import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

export async function promptOptions(
  state: State,
): Promise<[State, Node | null]> {
  const hasKhinsiderUrls = state.urls.some((url) =>
    url.startsWith("https://downloads.khinsider.com/game-soundtracks")
  );

  const options: { [key: string]: Node | null } = {
    "list": Node.LIST_URLS,
    "quit": null,
  };

  if (hasKhinsiderUrls) {
    options["resolve"] = Node.RESOLVE_URLS;
  } else {
    options["download"] = Node.DOWNLOAD_FILES;
  }

  while (true) {
    console.log("\nSelect an option:");
    Object.keys(options).forEach((option) => console.log(`- ${option}`));

    for await (const line of readLines(Deno.stdin)) {
      const choice = line.trim().toLowerCase();
      if (options.hasOwnProperty(choice)) {
        return [state, options[choice]];
      } else {
        console.log("Invalid option. Please try again.");
      }
      break;
    }
  }
}
