import { Next } from '../ambler.js';
import { downloadFile } from '../utils/download_files.js';
import path from 'path';

const defaultUtils = { downloader: downloadFile };

export function downloadFiles(edges, utils = defaultUtils) {
    return async (state) => {
        if (!state.m3uFilePath) {
            throw new Error('M3U file path is not defined.');
        }

        const outputFolder = path.basename(state.m3uFilePath, '.m3u');
        console.log(`Downloading files to: ${outputFolder}`);

        await Promise.all(state.urls.map((url) => utils.downloader(url, outputFolder)));

        console.log('All downloads complete.');
        return new Next(edges.onSuccess, state);
    };
}
