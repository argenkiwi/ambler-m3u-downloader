import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

export function listUrls(
  onSuccess: Nextable<State>
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    console.log("\n--- URLs ---");
    state.urls.forEach((url) => console.log(url));
    console.log("------------");
    return new Next(onSuccess, state);
  };
}
