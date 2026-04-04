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

const nodes: Record<string, Nextable<State>> = {};

const next = (key: string): Nextable<State> => (state) => nodes[key](state);

nodes["checkM3UFile"]  = checkM3UFile({ onRead: next("readM3UFile"), onPrompt: next("promptM3UFile") });
nodes["promptM3UFile"] = promptM3UFile({ onCheck: next("checkM3UFile") });
nodes["readM3UFile"]   = readM3UFile({ onSuccess: next("promptOptions") });
nodes["promptOptions"] = promptOptions({ onList: next("listUrls"), onResolve: next("resolveUrls"), onDownload: next("downloadFiles") });
nodes["listUrls"]      = listUrls({ onSuccess: next("promptOptions") });
nodes["resolveUrls"]   = resolveUrls({ onSuccess: next("saveM3UFile") });
nodes["saveM3UFile"]   = saveM3UFile({ onSuccess: next("promptOptions") });
nodes["downloadFiles"] = downloadFiles({ onSuccess: async (_state) => null });

if (import.meta.main) {
  await amble(nodes["checkM3UFile"], initialState);
}
