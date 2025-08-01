import { Next } from '../ambler.js';
import { listUrls } from './list_urls.js';
import { resolveUrls } from './resolve_urls.js';
import { downloadFiles } from './download_files.js';
import readline from 'readline';

export async function promptOptions(state) {
    const urls = state.urls;
    const options = ['quit', 'list'];
    const canResolve = urls.some(url => url.startsWith('https://downloads.khinsider.com/game-soundtracks'));

    if (canResolve) {
        options.push('resolve');
    } else {
        options.push('download');
    }

    console.log('Please select an option:');
    options.forEach(option => console.log(option));

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askForChoice() {
        return new Promise((resolve) => {
            rl.question('Enter your choice: ', (answer) => {
                resolve(answer);
            });
        });
    }

    const selectedOption = await askForChoice();
    rl.close();

    switch (selectedOption) {
        case 'quit':
            return null;
        case 'list':
            return new Next(listUrls, state);
        case 'resolve':
            return new Next(resolveUrls, state);
        case 'download':
            return new Next(downloadFiles, state);
        default:
            console.log("Invalid choice.");
            return new Next(promptOptions, state);
    }
}