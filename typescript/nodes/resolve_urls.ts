import { Node, State } from "../nodes.ts";
import { resolveKhinsiderUrl } from "../utils/resolve_khinsider_url.ts";

export async function resolveUrls(state: State): Promise<[State, Node]> {
  console.log("Resolving Khinsider URLs...");
  const resolvedUrls = await Promise.all(state.urls.map(async (url) => {
    if (url.startsWith("https://downloads.khinsider.com/game-soundtracks")) {
      return await resolveKhinsiderUrl(url);
    } else {
      return url;
    }
  }));
  console.log("Finished resolving URLs.");
  return [{ ...state, urls: resolvedUrls }, Node.SAVE_M3U_FILE];
}
