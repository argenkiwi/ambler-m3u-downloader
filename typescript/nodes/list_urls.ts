import { next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

type ListEdges = { onSuccess: Nextable<State> };

export function listUrls(edges: ListEdges) {
  return (state: State) => {
    console.log("\n--- URLs ---");
    state.urls.forEach((url) => console.log(url));
    console.log("------------");
    return next(edges.onSuccess, state);
  };
}
