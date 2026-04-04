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

export function promptOptions(edges, utils = defaultUtils) {
    return async (state) => {
        const hasKhinsiderUrls = state.urls.some((url) =>
            url.startsWith('https://downloads.khinsider.com/game-soundtracks')
        );

        const options = [
            ['quit', null],
            ['list', new Next(edges.onList, state)],
        ];

        if (hasKhinsiderUrls) {
            options.push(['resolve', new Next(edges.onResolve, state)]);
        } else {
            options.push(['download', new Next(edges.onDownload, state)]);
        }

        while (true) {
            console.log('\nSelect an option:');
            options.forEach(([name], i) => console.log(`${i + 1}. ${name}`));

            const line = await utils.readLine();
            const choice = parseInt(line, 10) - 1;
            if (choice >= 0 && choice < options.length) {
                return options[choice][1];
            }
            console.log('Invalid option. Please try again.');
        }
    };
}
