import { Node, State } from "../nodes.ts";

export async function listUrls(state: State): Promise<[State, Node]> {
  console.log("\n--- URLs ---");
  state.urls.forEach((url) => console.log(url));
  console.log("------------");
  return [state, Node.PROMPT_OPTIONS];
}
