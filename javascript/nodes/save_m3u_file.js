import { Next } from '../ambler.js';
import { promptOptions } from './prompt_options.js';
import fs from 'fs';

export async function saveM3UFile(state) {
    fs.writeFileSync(state.m3uFilePath, state.urls.join('\n'));
    console.log(`Resolved URLs saved to ${state.m3uFilePath}`);
    return new Next(promptOptions, state);
}