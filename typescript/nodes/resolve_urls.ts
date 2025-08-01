import { Next } from "../ambler.ts";
import { State } from "../state.ts";
import { resolveKhinsiderUrl } from "../utils/resolve_khinsider_url.ts";
import { saveM3UFile } from "./save_m3u_file.ts";
 
export async function resolveUrls(state: State): Promise<Next<State>> {
  console.log("Resolving Khinsider URLs...");
  const resolvedUrls = await Promise.all(state.urls.map(async (url) => {
    if (url.startsWith("https://downloads.khinsider.com/game-soundtracks")) {
      return await resolveKhinsiderUrl(url);
    } else {
      return url;
    }
  }));
  console.log("Finished resolving URLs.");
  return new Next(saveM3UFile, { ...state, urls: resolvedUrls });
}
