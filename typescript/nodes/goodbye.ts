import { Nextable } from "../ambler.ts";

export namespace Goodbye {
  export interface State {}

  export type Utils = { log: (message: string) => void };

  const defaultUtils: Utils = {
    log: (message) => console.log(message),
  };

  export function create<S extends State>(
    utils: Utils = defaultUtils
  ): Nextable<S> {
    return async (_state: S): Promise<null> => {
      utils.log("\nThank you for using the M3U Downloader! Have a great day!");
      return null;
    };
  }
}
