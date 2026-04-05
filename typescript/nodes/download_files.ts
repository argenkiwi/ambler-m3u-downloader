import { resolve } from "@std/path";
import { toFileUrl } from "@std/path";
import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";
import { downloadFile } from "../utils/download_files.ts";

type DownloadEdges = { onSuccess: Nextable<State> };
type DownloadUtils = {
  downloader: (url: string, outputFolder: string) => Promise<string>;
  remove: (path: string) => Promise<void>;
  toFileUri: (path: string) => string;
};

const defaultUtils: DownloadUtils = {
  downloader: downloadFile,
  remove: (path) => Deno.remove(path),
  toFileUri: (path) => toFileUrl(resolve(path)).href,
};

export function downloadFiles(
  edges: DownloadEdges,
  utils: DownloadUtils = defaultUtils
): Nextable<State> {
  return async (state: State): Promise<Next<State> | null> => {
    if (!state.m3uFilePath) {
      throw new Error("M3U file path is not defined.");
    }

    const outputFolder =
      state.m3uFilePath.split("/").pop()?.replace(".m3u", "") || "downloads";
    console.log(`Downloading files to: ${outputFolder}`);

    const localPaths = await Promise.all(
      state.urls.map((url) => utils.downloader(url, outputFolder))
    );

    console.log("All downloads complete.");

    const playlistPath = `${outputFolder}/playlist.m3u`;
    const fileUris = localPaths.map((p) => utils.toFileUri(p));
    await utils.remove(state.m3uFilePath);

    return new Next(edges.onSuccess, { m3uFilePath: playlistPath, urls: fileUris });
  };
}
