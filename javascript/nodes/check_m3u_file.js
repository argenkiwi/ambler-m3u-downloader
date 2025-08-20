import { Next } from '../ambler.js';
import { readM3UFile } from './read_m3u_file.js';
import { promptM3UFile } from './prompt_m3u_file.js';
import fs from 'fs';

export async function checkM3UFile(state) {
    let m3uFilePath = state.m3uFilePath;

    if (m3uFilePath && fs.existsSync(m3uFilePath) && fs.statSync(m3uFilePath).isFile() && m3uFilePath.endsWith('.m3u')) {
        return new Next(readM3UFile, { ...state, m3uFilePath });
    } else {
        return new Next(promptM3UFile, { ...state, m3uFilePath: null });
    }
}
