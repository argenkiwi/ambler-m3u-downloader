import { Next, Nextable } from "../ambler.ts";
import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

export interface PromptOptionsState {
  urls: string[];
}

type OptionsEdges<S> = {
  onList: Nextable<S>;
  onResolve: Nextable<S>;
  onDownload: Nextable<S>;
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

export function promptOptions<S extends PromptOptionsState>(
  edges: OptionsEdges<S>,
  utils: OptionsUtils = defaultUtils
): Nextable<S> {
  return async (state: S): Promise<Next<S> | null> => {
    const hasKhinsiderUrls = state.urls.some((url) =>
      url.startsWith("https://downloads.khinsider.com/game-soundtracks")
    );

    const options: { name: string; value: Next<S> | null }[] = [
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
