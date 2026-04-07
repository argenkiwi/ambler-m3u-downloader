import { Next, Nextable } from "../ambler.ts";
import { resolveKhinsiderUrl } from "../utils/resolve_khinsider_url.ts";

export namespace ResolveUrls {
  export interface State {
    urls: string[];
  }

  export type Edges<S> = { onSuccess: Nextable<S> };
  export type Utils = { resolver: (url: string) => Promise<string> };

  const defaultUtils: Utils = { resolver: resolveKhinsiderUrl };

  export function create<S extends State>(
    edges: Edges<S>,
    utils: Utils = defaultUtils
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
}
