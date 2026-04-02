import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";
import { downloadFile } from "../utils/download_files.ts";

export function downloadFiles(): Nextable<State> {
  return async (state: State): Promise<Next<State> | null> => {
    if (!state.m3uFilePath) {
      throw new Error("M3U file path is not defined.");
    }

    const outputFolder =
      state.m3uFilePath.split("/").pop()?.replace(".m3u", "") || "downloads";
    console.log(`Downloading files to: ${outputFolder}`);

    await Promise.all(state.urls.map((url) => downloadFile(url, outputFolder)));

    console.log("All downloads complete.");
    return null;
  };
}
