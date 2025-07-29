export enum Node {
  CHECK_M3U_FILE,
  READ_M3U_FILE,
  PROMPT_OPTIONS,
  LIST_URLS,
  RESOLVE_URLS,
  SAVE_M3U_FILE,
  DOWNLOAD_FILES,
}

export interface State {
  m3uFilePath: string | null;
  urls: string[];
}
