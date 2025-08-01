import { Next } from "../ambler.ts";
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

  const options: { name: string, value: Next<State> | null }[] = [
    { name: "quit", value: null },
    { name: "list", value: new Next(listUrls, state) },
  ];

  if (hasKhinsiderUrls) {
    options.push({ name: "resolve", value: new Next(resolveUrls, state) });
  } else {
    options.push({ name: "download", value: new Next(downloadFiles, state) });
  }

  while (true) {
    console.log("\nSelect an option:");
    options.forEach((option, i) => console.log(`${i + 1}. ${option.name}`));

    for await (const line of readLines(Deno.stdin)) {
      const choice = parseInt(line.trim(), 10) - 1;
      if (choice >= 0 && choice < options.length) {
        return options[choice].value;
      } else {
        console.log("Invalid option. Please try again.");
      }
      break;
    }
  }
}
