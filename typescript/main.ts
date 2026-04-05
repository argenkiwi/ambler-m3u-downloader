import { amble, node } from "./ambler.ts";
import { State } from "./state.ts";
import { checkM3UFile } from "./nodes/check_m3u_file.ts";
import { readM3UFile } from "./nodes/read_m3u_file.ts";
import { promptResolve } from "./nodes/prompt_resolve.ts";
import { resolveUrls } from "./nodes/resolve_urls.ts";
import { saveM3UFile } from "./nodes/save_m3u_file.ts";
import { promptDownload } from "./nodes/prompt_download.ts";
import { downloadFiles } from "./nodes/download_files.ts";

const initialState: State = {
  m3uFilePath: Deno.args[0] || null,
  urls: [],
};

const download = node(() => downloadFiles({ onSuccess: (_state: State) => null }));
const promptDl = node(() => promptDownload({ onDownload: download }));
const save = node(() => saveM3UFile({ onSuccess: promptDl }));
const resolve = node(() => resolveUrls({ onSuccess: save }));
const promptRes = node(() => promptResolve({ onResolve: resolve }));
const read = node(() => readM3UFile({ onResolve: promptRes, onDownload: promptDl }));
const check = node(() => checkM3UFile({ onRead: read }));

if (import.meta.main) {
  await amble(check, initialState);
}
