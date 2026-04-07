import { Next, Nextable } from "../ambler.ts";

export namespace ListUrls {
  export interface State {
    urls: string[];
  }

  export type Edges<S> = { onSuccess: Nextable<S> };

  export function create<S extends State>(
    edges: Edges<S>
  ): Nextable<S> {
    return async (state: S): Promise<Next<S>> => {
      console.log("\n--- URLs ---");
      state.urls.forEach((url) => console.log(url));
      console.log("------------");
      return new Next(edges.onSuccess, state);
    };
  }
}
