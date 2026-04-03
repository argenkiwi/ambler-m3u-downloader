import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";
import { resolveKhinsiderUrl } from "../utils/resolve_khinsider_url.ts";

type ResolveEdges = { onSuccess: Nextable<State> };
type ResolveUtils = { resolver: (url: string) => Promise<string> };

const defaultUtils: ResolveUtils = { resolver: resolveKhinsiderUrl };

export function resolveUrls(
  edges: ResolveEdges,
  utils: ResolveUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    console.log("Resolving Khinsider URLs...");
    const resolvedUrls = await Promise.all(state.urls.map(async (url) => {
      if (url.startsWith("https://downloads.khinsider.com/game-soundtracks")) {
        return await utils.resolver(url);
      } else {
        return url;
      }
    }));
    console.log("Finished resolving URLs.");
    return new Next(edges.onSuccess, { ...state, urls: resolvedUrls });
  };
}
