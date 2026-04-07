import { amble, node } from "./ambler.ts";
import { State } from "./state.ts";
import { checkM3UFile } from "./nodes/check_m3u_file.ts";
import { promptM3UFile } from "./nodes/prompt_m3u_file.ts";
import { readM3UFile } from "./nodes/read_m3u_file.ts";
import { promptOptions } from "./nodes/prompt_options.ts";
import { listUrls } from "./nodes/list_urls.ts";
import { resolveUrls } from "./nodes/resolve_urls.ts";
import { saveM3UFile } from "./nodes/save_m3u_file.ts";
import { downloadFiles } from "./nodes/download_files.ts";
import { goodbye } from "./nodes/goodbye.ts";
import { Nextable } from "./ambler.ts";

const initialState: State = {
  m3uFilePath: Deno.args[0] || null,
  urls: [],
};

// Entry loop
const check: Nextable<State> = node(() => checkM3UFile({ onRead: read, onPrompt: prompt }));
const read: Nextable<State> = node(() => readM3UFile({ onSuccess: options }))
const prompt: Nextable<State> = node(() => promptM3UFile({ onCheck: check }));

// Main menu
const exit: Nextable<State> = node(() => goodbye());
const options: Nextable<State> = node(() => promptOptions({ onList: list, onResolve: resolve, onDownload: download, onExit: exit }));
const list: Nextable<State> = node(() => listUrls({ onSuccess: options }));
const resolve: Nextable<State> = node(() => resolveUrls({ onSuccess: save }));
const save: Nextable<State> = node(() => saveM3UFile({ onSuccess: options }));

// Terminal node
const download: Nextable<State> = node(() => downloadFiles({ onSuccess: exit }));

if (import.meta.main) {
  await amble(check, initialState);
}
