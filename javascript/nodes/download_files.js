import path from 'path';
import { downloadFile } from '../utils/download_files.js';

export async function downloadFiles(state) {
    console.log("Downloading files...");
    const outputFolderName = path.basename(state.m3u_file_path, '.m3u');

    await Promise.all(state.urls.map(async (url) => {
        try {
            await downloadFile(url, outputFolderName);
            console.log(`Downloaded: ${url}`);
        } catch (error) {
            console.error(`Error downloading ${url}: ${error.message}`);
        }
    }));

    console.log("All downloads complete.");
    return null;
}
