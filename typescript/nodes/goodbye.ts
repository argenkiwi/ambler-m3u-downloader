import { Nextable } from "../ambler.ts";

export interface GoodbyeState {}

type GoodbyeUtils = { log: (message: string) => void };

const defaultUtils: GoodbyeUtils = {
  log: (message) => console.log(message),
};

export function goodbye<S extends GoodbyeState>(
  utils: GoodbyeUtils = defaultUtils
): Nextable<S> {
  return async (_state: S): Promise<null> => {
    utils.log("\nThank you for using the M3U Downloader! Have a great day!");
    return null;
  };
}
