import { Next } from '../ambler.js';

export function listUrls(edges) {
    return async (state) => {
        console.log('\n--- URLs ---');
        state.urls.forEach((url) => console.log(url));
        console.log('------------');
        return new Next(edges.onSuccess, state);
    };
}
