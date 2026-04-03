import { amble, Nextable } from "./ambler.ts";
import { State } from "./state.ts";
import { checkM3UFile } from "./nodes/check_m3u_file.ts";
import { promptM3UFile } from "./nodes/prompt_m3u_file.ts";
import { readM3UFile } from "./nodes/read_m3u_file.ts";
import { promptOptions } from "./nodes/prompt_options.ts";
import { listUrls } from "./nodes/list_urls.ts";
import { resolveUrls } from "./nodes/resolve_urls.ts";
import { saveM3UFile } from "./nodes/save_m3u_file.ts";
import { downloadFiles } from "./nodes/download_files.ts";

const initialState: State = {
  m3uFilePath: Deno.args[0] || null,
  urls: [],
};

// 1. Define leaf/linear nodes
const list = (state: State) => listUrls({ onSuccess: options })(state); // Recursive back to options
const save = resolveUrls({
  onSuccess: saveM3UFile({ onSuccess: (state: State) => options(state) }),
});
const download = downloadFiles({ onSuccess: (_state: State) => null }); // End of program.

// 2. Define the main options menu (forward reference for some)
const options = promptOptions({ onList: list, onResolve: save, onDownload: download });

// 3. Define entry loop
let check: Nextable<State>;
const prompt = promptM3UFile({ onCheck: (state: State) => check(state) });
check = checkM3UFile({
  onRead: readM3UFile({ onSuccess: options }),
  onPrompt: prompt,
});

if (import.meta.main) {
  await amble(check, initialState);
}
