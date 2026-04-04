import { Next } from '../ambler.js';
import fs from 'fs';

const defaultUtils = { stat: (path) => fs.statSync(path) };

export function checkM3UFile(edges, utils = defaultUtils) {
    return async (state) => {
        const { m3uFilePath } = state;

        if (m3uFilePath) {
            try {
                const fileInfo = utils.stat(m3uFilePath);
                if (fileInfo.isFile() && m3uFilePath.endsWith('.m3u')) {
                    return new Next(edges.onRead, state);
                }
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`File not found: ${m3uFilePath}`);
                } else {
                    console.log(`Error accessing file: ${error.message}`);
                }
            }
        }

        return new Next(edges.onPrompt, state);
    };
}
