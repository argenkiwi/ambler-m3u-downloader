import { amble } from "./ambler.ts";
import { State } from "./state.ts";
import { checkM3UFile } from "./nodes/check_m3u_file.ts";

const initialState: State = {
  m3uFilePath: null,
  urls: [],
};

if (import.meta.main) {
  await amble(checkM3UFile, initialState);
}
