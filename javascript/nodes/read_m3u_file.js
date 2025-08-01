import { Next } from '../ambler.js';
import { promptOptions } from './prompt_options.js';
import fs from 'fs';

export async function readM3UFile(state) {
    const urls = fs.readFileSync(state.m3uFilePath, 'utf-8').split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
    return new Next(promptOptions, { ...state, urls });
}
