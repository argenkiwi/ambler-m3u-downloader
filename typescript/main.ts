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

enum Node {
  CheckM3UFile,
  PromptM3UFile,
  ReadM3UFile,
  PromptOptions,
  ListUrls,
  ResolveUrls,
  SaveM3UFile,
  DownloadFiles,
}

function next(node: Node): Nextable<State> {
  return (state: State) => {
    switch (node) {
      case Node.CheckM3UFile:
        return checkM3UFile({ onRead: next(Node.ReadM3UFile), onPrompt: next(Node.PromptM3UFile) })(state);
      case Node.PromptM3UFile:
        return promptM3UFile({ onCheck: next(Node.CheckM3UFile) })(state);
      case Node.ReadM3UFile:
        return readM3UFile({ onSuccess: next(Node.PromptOptions) })(state);
      case Node.PromptOptions:
        return promptOptions({ onList: next(Node.ListUrls), onResolve: next(Node.ResolveUrls), onDownload: next(Node.DownloadFiles) })(state);
      case Node.ListUrls:
        return listUrls({ onSuccess: next(Node.PromptOptions) })(state);
      case Node.ResolveUrls:
        return resolveUrls({ onSuccess: next(Node.SaveM3UFile) })(state);
      case Node.SaveM3UFile:
        return saveM3UFile({ onSuccess: next(Node.PromptOptions) })(state);
      case Node.DownloadFiles:
        return downloadFiles({ onSuccess: (_state) => null })(state);
    }
  };
}

if (import.meta.main) {
  await amble(next(Node.CheckM3UFile), initialState);
}
