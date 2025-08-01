import { amble } from './ambler.js';
import { checkM3UFile } from './nodes/check_m3u_file.js';

const initialState = {
    m3uFilePath: process.argv[2] || null,
    urls: [],
};

(async () => {
    await amble(checkM3UFile, initialState);
})();