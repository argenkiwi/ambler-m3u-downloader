import { Next } from '../ambler.js';
import { promptOptions } from './prompt_options.js';

export async function listUrls(state) {
    state.urls.forEach(url => console.log(url));
    return new Next(promptOptions, state);
}