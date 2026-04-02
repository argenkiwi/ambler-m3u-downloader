import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";
import { resolveKhinsiderUrl as defaultResolver } from "../utils/resolve_khinsider_url.ts";

export function resolveUrls(
  onSuccess: Nextable<State>,
  resolver: (url: string) => Promise<string> = defaultResolver
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    console.log("Resolving Khinsider URLs...");
    const resolvedUrls = await Promise.all(state.urls.map(async (url) => {
      if (url.startsWith("https://downloads.khinsider.com/game-soundtracks")) {
        return await resolver(url);
      } else {
        return url;
      }
    }));
    console.log("Finished resolving URLs.");
    return new Next(onSuccess, { ...state, urls: resolvedUrls });
  };
}
