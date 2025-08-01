import { Next } from '../ambler.js';
import { readM3UFile } from './read_m3u_file.js';
import fs from 'fs';
import readline from 'readline';

export async function checkM3UFile(state) {
    let m3uFilePath = state.m3uFilePath;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askForPath() {
        return new Promise((resolve) => {
            rl.question('Please select an m3u file: ', (answer) => {
                resolve(answer);
            });
        });
    }

    while (!m3uFilePath || !fs.existsSync(m3uFilePath) || !fs.statSync(m3uFilePath).isFile() || !m3uFilePath.endsWith('.m3u')) {
        if (m3uFilePath) {
            console.log("Invalid file path. Please provide a valid .m3u file.");
        }
        m3uFilePath = await askForPath();
    }

    rl.close();

    return new Next(readM3UFile, { ...state, m3uFilePath });
}
