import { Next } from '../ambler.js';
import fs from 'fs';

const defaultUtils = { readTextFile: (path) => fs.readFileSync(path, 'utf-8') };

export function readM3UFile(edges, utils = defaultUtils) {
    return async (state) => {
        if (!state.m3uFilePath) {
            throw new Error('M3U file path is not defined.');
        }

        const content = utils.readTextFile(state.m3uFilePath);
        const urls = content.split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0 && !line.startsWith('#'));

        console.log(`Found ${urls.length} URLs in ${state.m3uFilePath}`);
        return new Next(edges.onSuccess, { ...state, urls });
    };
}
