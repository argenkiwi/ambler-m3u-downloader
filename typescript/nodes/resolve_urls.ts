import { Next, Nextable } from "../ambler.ts";
import { resolveKhinsiderUrl } from "../utils/resolve_khinsider_url.ts";

export interface ResolveUrlsState {
  urls: string[];
}

type ResolveEdges<S> = { onSuccess: Nextable<S> };
type ResolveUtils = { resolver: (url: string) => Promise<string> };

const defaultUtils: ResolveUtils = { resolver: resolveKhinsiderUrl };

export function resolveUrls<S extends ResolveUrlsState>(
  edges: ResolveEdges<S>,
  utils: ResolveUtils = defaultUtils
): Nextable<S> {
  return async (state: S): Promise<Next<S>> => {
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
