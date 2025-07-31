import { amble, Next } from './ambler.js';
import { nodes } from './nodes.js';

(async () => {
    const initial_state = {
        m3u_file_path: process.argv[2] || null,
        urls: [],
        resolved_urls: [],
    };
    amble(new Next(nodes.checkM3UFile, initial_state));
})();
