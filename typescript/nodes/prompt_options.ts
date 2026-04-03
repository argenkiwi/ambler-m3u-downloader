import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";
import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

type OptionsEdges = {
  onList: Nextable<State>;
  onResolve: Nextable<State>;
  onDownload: Nextable<State>;
};
type OptionsUtils = { readLine: () => Promise<string> };

const defaultUtils: OptionsUtils = {
  readLine: async () => {
    for await (const line of readLines(Deno.stdin)) {
      return line;
    }
    return "";
  },
};

export function promptOptions(
  edges: OptionsEdges,
  utils: OptionsUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State> | null> => {
    const hasKhinsiderUrls = state.urls.some((url) =>
      url.startsWith("https://downloads.khinsider.com/game-soundtracks")
    );

    const options: { name: string; value: Next<State> | null }[] = [
      { name: "quit", value: null },
      { name: "list", value: new Next(edges.onList, state) },
    ];

    if (hasKhinsiderUrls) {
      options.push({ name: "resolve", value: new Next(edges.onResolve, state) });
    } else {
      options.push({ name: "download", value: new Next(edges.onDownload, state) });
    }

    while (true) {
      console.log("\nSelect an option:");
      options.forEach((option, i) => console.log(`${i + 1}. ${option.name}`));

      const line = await utils.readLine();
      const choice = parseInt(line.trim(), 10) - 1;
      if (choice >= 0 && choice < options.length) {
        return options[choice].value;
      } else {
        console.log("Invalid option. Please try again.");
      }
    }
  };
}
