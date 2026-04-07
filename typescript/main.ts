import { amble, node, Nextable } from "./ambler.ts";
import { State } from "./state.ts";
import { CheckM3UFile } from "./nodes/check_m3u_file.ts";
import { PromptM3UFile } from "./nodes/prompt_m3u_file.ts";
import { ReadM3UFile } from "./nodes/read_m3u_file.ts";
import { PromptOptions } from "./nodes/prompt_options.ts";
import { ListUrls } from "./nodes/list_urls.ts";
import { ResolveUrls } from "./nodes/resolve_urls.ts";
import { SaveM3UFile } from "./nodes/save_m3u_file.ts";
import { DownloadFiles } from "./nodes/download_files.ts";
import { Goodbye } from "./nodes/goodbye.ts";

const initialState: State = {
  m3uFilePath: Deno.args[0] || null,
  urls: [],
};

// Nodes
const nodes: Record<string, Nextable<State>> = {
  check: node(() => CheckM3UFile.create({ onRead: nodes.read, onPrompt: nodes.prompt })),
  read: node(() => ReadM3UFile.create({ onSuccess: nodes.options })),
  prompt: node(() => PromptM3UFile.create({ onCheck: nodes.check })),
  exit: node(() => Goodbye.create()),
  options: node(() => PromptOptions.create({ onList: nodes.list, onResolve: nodes.resolve, onDownload: nodes.download, onExit: nodes.exit })),
  list: node(() => ListUrls.create({ onSuccess: nodes.options })),
  resolve: node(() => ResolveUrls.create({ onSuccess: nodes.save })),
  save: node(() => SaveM3UFile.create({ onSuccess: nodes.options })),
  download: node(() => DownloadFiles.create({ onSuccess: nodes.exit })),
};

if (import.meta.main) {
  await amble(nodes.check, initialState);
}
