import { Next, Nextable } from "../ambler.ts";

export interface ListUrlsState {
  urls: string[];
}

type ListEdges<S> = { onSuccess: Nextable<S> };

export function listUrls<S extends ListUrlsState>(
  edges: ListEdges<S>
): Nextable<S> {
  return async (state: S): Promise<Next<S>> => {
    console.log("\n--- URLs ---");
    state.urls.forEach((url) => console.log(url));
    console.log("------------");
    return new Next(edges.onSuccess, state);
  };
}
