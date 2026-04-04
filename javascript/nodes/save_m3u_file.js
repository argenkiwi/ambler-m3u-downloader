import { Next } from '../ambler.js';
import fs from 'fs';

const defaultUtils = { writeTextFile: (path, content) => fs.writeFileSync(path, content) };

export function saveM3UFile(edges, utils = defaultUtils) {
    return async (state) => {
        if (!state.m3uFilePath) {
            throw new Error('M3U file path is not defined.');
        }

        const content = state.urls.join('\n');
        utils.writeTextFile(state.m3uFilePath, content);
        console.log(`Saved resolved URLs to ${state.m3uFilePath}`);
        return new Next(edges.onSuccess, state);
    };
}
