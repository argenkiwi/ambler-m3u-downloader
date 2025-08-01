import { Next } from "../ambler.ts";
import { State } from "../state.ts";
import { promptOptions } from "./prompt_options.ts";

export async function listUrls(state: State): Promise<Next<State>> {
  console.log("\n--- URLs ---");
  state.urls.forEach((url) => console.log(url));
  console.log("------------");
  return new Next(promptOptions, state);
}
