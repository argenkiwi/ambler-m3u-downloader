import { Next } from '../ambler.js';
import { promptOptions } from './prompt_options.js';
import { downloadFile } from '../utils/download_files.js';
import path from 'path';

export async function downloadFiles(state) {
    const outputFolder = path.basename(state.m3uFilePath, '.m3u');
    console.log(`Downloading to ${outputFolder} folder...`);

    await Promise.all(state.urls.map(url => downloadFile(url, outputFolder)));

    console.log("All files downloaded.");
    return new Next(promptOptions, state);
}