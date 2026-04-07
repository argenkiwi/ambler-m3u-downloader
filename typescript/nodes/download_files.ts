import { Next, Nextable } from "../ambler.ts";
import { downloadFile } from "../utils/download_files.ts";

export interface DownloadFilesState {
  m3uFilePath: string | null;
  urls: string[];
}

type DownloadEdges<S> = { onSuccess: Nextable<S> };
type DownloadUtils = { downloader: (url: string, outputFolder: string) => Promise<void> };

const defaultUtils: DownloadUtils = { downloader: downloadFile };

export function downloadFiles<S extends DownloadFilesState>(
  edges: DownloadEdges<S>,
  utils: DownloadUtils = defaultUtils
): Nextable<S> {
  return async (state: S): Promise<Next<S> | null> => {
    if (!state.m3uFilePath) {
      throw new Error("M3U file path is not defined.");
    }

    const outputFolder =
      state.m3uFilePath.split("/").pop()?.replace(".m3u", "") || "downloads";
    console.log(`Downloading files to: ${outputFolder}`);

    await Promise.all(state.urls.map((url) => utils.downloader(url, outputFolder)));

    console.log("All downloads complete.");
    return new Next(edges.onSuccess, state);
  };
}
