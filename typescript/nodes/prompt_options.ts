import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";
import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";
import { listUrls } from "./list_urls.ts";
import { resolveUrls } from "./resolve_urls.ts";
import { downloadFiles } from "./download_files.ts";

export async function promptOptions(
  state: State,
): Promise<Next<State> | null> {
  const hasKhinsiderUrls = state.urls.some((url) =>
    url.startsWith("https://downloads.khinsider.com/game-soundtracks")
  );

  const options: { [key: string]: Next<State> | null ; } = {
    "list": new Next(listUrls, state),
    "quit": null,
  };

  if (hasKhinsiderUrls) {
    options["resolve"] = new Next(resolveUrls, state);
  } else {
    options["download"] = new Next(downloadFiles, state);
  }

  while (true) {
    console.log("\nSelect an option:");
    Object.keys(options).forEach((option) => console.log(`- ${option}`));

    for await (const line of readLines(Deno.stdin)) {
      const choice = line.trim().toLowerCase();
      if (options.hasOwnProperty(choice)) {
        return options[choice];
      } else {
        console.log("Invalid option. Please try again.");
      }
      break;
    }
  }
}
