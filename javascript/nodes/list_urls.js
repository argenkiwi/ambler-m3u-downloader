import { Next } from '../ambler.js';
import { nodes } from '../nodes.js';

export async function listUrls(state) {
    console.log("\n--- URLs ---");
    state.urls.forEach(url => console.log(url));
    console.log("------------");
    return new Next(nodes.promptOptions, state);
}

