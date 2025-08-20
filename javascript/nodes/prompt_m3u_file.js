import { Next } from '../ambler.js';
import { checkM3UFile } from './check_m3u_file.js';
import readline from 'readline';

export async function promptM3UFile(state) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askForPath() {
        return new Promise((resolve) => {
            rl.question('Please enter the path to your M3U file: ', (answer) => {
                resolve(answer);
            });
        });
    }

    let m3uFilePath = await askForPath();
    rl.close();

    if (!m3uFilePath) {
        console.log("No M3U file path provided. Exiting.");
        return null; // Terminate if empty input
    }

    return new Next(checkM3UFile, { ...state, m3uFilePath });
}
