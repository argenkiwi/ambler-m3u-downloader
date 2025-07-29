import { amble } from "./ambler.ts";
import { Node, State } from "./nodes.ts";
import { checkM3UFile } from "./nodes/check_m3u_file.ts";
import { readM3UFile } from "./nodes/read_m3u_file.ts";
import { promptOptions } from "./nodes/prompt_options.ts";
import { listUrls } from "./nodes/list_urls.ts";
import { resolveUrls } from "./nodes/resolve_urls.ts";
import { saveM3UFile } from "./nodes/save_m3u_file.ts";
import { downloadFiles } from "./nodes/download_files.ts";

async function direct(state: State, node: Node): Promise<[State, Node | null]> {
  switch (node) {
    case Node.CHECK_M3U_FILE:
      return await checkM3UFile(state);
    case Node.READ_M3U_FILE:
      return await readM3UFile(state);
    case Node.PROMPT_OPTIONS:
      return await promptOptions(state);
    case Node.LIST_URLS:
      return await listUrls(state);
    case Node.RESOLVE_URLS:
      return await resolveUrls(state);
    case Node.SAVE_M3U_FILE:
      return await saveM3UFile(state);
    case Node.DOWNLOAD_FILES:
      return await downloadFiles(state);
    default:
      throw new Error(`Unknown node: ${node}`);
  }
}

const initialState: State = {
  m3uFilePath: null,
  urls: [],
};

if (import.meta.main) {
  await amble(initialState, Node.CHECK_M3U_FILE, direct);
}
