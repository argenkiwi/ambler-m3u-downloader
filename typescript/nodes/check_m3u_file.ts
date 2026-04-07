import { Next, Nextable } from "../ambler.ts";

export namespace CheckM3UFile {
  export interface State {
    m3uFilePath: string | null;
  }

  export type Edges<S> = { onRead: Nextable<S>; onPrompt: Nextable<S> };
  export type Utils = { stat: (path: string) => Promise<Deno.FileInfo> };

  const defaultUtils: Utils = {
    stat: (path) => Deno.stat(path),
  };

  export function create<S extends State>(
    edges: Edges<S>,
    utils: Utils = defaultUtils
  ): Nextable<S> {
    return async (state: S): Promise<Next<S>> => {
      const { m3uFilePath } = state;

      if (m3uFilePath) {
        try {
          const fileInfo = await utils.stat(m3uFilePath);
          if (fileInfo.isFile && m3uFilePath.endsWith(".m3u")) {
            return new Next(edges.onRead, state);
          }
        } catch (error) {
          if (error instanceof Deno.errors.NotFound) {
            console.log(`File not found: ${m3uFilePath}`);
          } else {
            console.log(`Error accessing file: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      }

      return new Next(edges.onPrompt, state);
    };
  }
}
