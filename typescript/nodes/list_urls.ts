import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

type ListEdges = { onSuccess: Nextable<State> };

export function listUrls(
  edges: ListEdges
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    console.log("\n--- URLs ---");
    state.urls.forEach((url) => console.log(url));
    console.log("------------");
    return new Next(edges.onSuccess, state);
  };
}
