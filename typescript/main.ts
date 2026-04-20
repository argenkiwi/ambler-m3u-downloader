import { amble, Nextable, node } from "./ambler.ts";
import { State } from "./state.ts";
import * as CheckM3UFile from "./nodes/check_m3u_file.ts";
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

const nodes: Record<string, Nextable<S extends State>> = {
  check: node(() =>
    CheckM3UFile.create({ onRead: nodes.read, onPrompt: nodes.prompt })
  ),
  read: node(() => readM3UFile({ onSuccess: nodes.options })),
  prompt: node(() => promptM3UFile({ onCheck: nodes.check })),
  options: node(() =>
    promptOptions({
      onList: nodes.list,
      onResolve: nodes.resolve,
      onDownload: nodes.download,
    })
  ),
  list: node(() => listUrls({ onSuccess: nodes.options })),
  resolve: node(() => resolveUrls({ onSuccess: nodes.save })),
  save: node(() => saveM3UFile({ onSuccess: nodes.options })),
  download: node(() => downloadFiles({ onSuccess: (_state: State) => null })),
};

if (import.meta.main) {
  await amble(nodes.check, initialState);
}
