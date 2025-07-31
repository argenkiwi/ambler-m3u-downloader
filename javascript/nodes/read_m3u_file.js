import fs from 'fs';
import { Next } from '../ambler.js';
import { nodes } from '../nodes.js';

export async function readM3UFile(state) {
    const filePath = state.m3u_file_path;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const urls = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            urls.push(trimmedLine);
        }
    }

    state.urls = urls;
    console.log(`Found ${urls.length} URLs in the M3U file.`);
    return new Next(nodes.promptOptions, state);
}
