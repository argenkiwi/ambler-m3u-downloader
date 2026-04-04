import { Next } from '../ambler.js';
import { createInterface } from 'readline';

const defaultUtils = {
    readLine: () => new Promise((resolve) => {
        const rl = createInterface({ input: process.stdin });
        rl.once('line', (line) => {
            rl.close();
            resolve(line.trim());
        });
    }),
};

export function promptM3UFile(edges, utils = defaultUtils) {
    return async (state) => {
        console.log('Please enter the path to your M3U file:');
        const m3uFilePath = await utils.readLine();

        if (!m3uFilePath) {
            return new Next(promptM3UFile(edges, utils), state);
        }

        return new Next(edges.onCheck, { ...state, m3uFilePath });
    };
}
