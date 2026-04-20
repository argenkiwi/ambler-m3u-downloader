import { next, Nextable } from "../ambler.ts";

type State = { m3uFilePath: string };
type Edges<S extends State> = {
  onRead: Nextable<S>;
  onPrompt: Nextable<S>;
};

type Utils = { stat: (path: string) => Promise<Deno.FileInfo> };

const defaultUtils: Utils = {
  stat: (path) => Deno.stat(path),
};

export function create<S extends State>(
  edges: Edges<S>,
  utils: Utils = defaultUtils,
) {
  return async (state: S) => {
    const { m3uFilePath } = state;
    if (m3uFilePath) {
      try {
        const fileInfo = await utils.stat(m3uFilePath);
        if (fileInfo.isFile && m3uFilePath.endsWith(".m3u")) {
          return next(edges.onRead, state);
        }
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          console.log(`File not found: ${m3uFilePath}`);
        } else {
          console.log(
            `Error accessing file: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      }
    }

    return next(edges.onPrompt, state);
  };
}
