import { Node, State } from "../nodes.ts";
import { downloadFile } from "../utils/download_files.ts";

export async function downloadFiles(state: State): Promise<[State, null]> {
  if (!state.m3uFilePath) {
    throw new Error("M3U file path is not defined.");
  }

  const outputFolder =
    state.m3uFilePath.split("/").pop()?.replace(".m3u", "") || "downloads";
  console.log(`Downloading files to: ${outputFolder}`);

  await Promise.all(state.urls.map((url) => downloadFile(url, outputFolder)));

  console.log("All downloads complete.");
  return [state, null];
}
