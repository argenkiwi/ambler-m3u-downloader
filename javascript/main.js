const { amble, resolve } = require('./ambler');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const Node = require('./nodes');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function direct(state, node) {
    switch (node) {
        case Node.CHECK_M3U_FILE:
            const checkM3UFile = require('./nodes/check_m3u_file');
            return resolve(await checkM3UFile(state, rl), (next_node) => next_node);
        case Node.READ_M3U_FILE:
            const readM3UFile = require('./nodes/read_m3u_file');
            return resolve(await readM3UFile(state), (next_node) => next_node);
        case Node.PROMPT_OPTIONS:
            const promptOptions = require('./nodes/prompt_options');
            return resolve(await promptOptions(state, rl), (next_node) => next_node);
        case Node.LIST_URLS:
            const listUrls = require('./nodes/list_urls');
            return resolve(await listUrls(state), (next_node) => next_node);
        case Node.RESOLVE_URLS:
            const resolveUrls = require('./nodes/resolve_urls');
            return resolve(await resolveUrls(state), (next_node) => next_node);
        case Node.SAVE_M3U_FILE:
            const saveM3UFile = require('./nodes/save_m3u_file');
            return resolve(await saveM3UFile(state), (next_node) => next_node);
        case Node.DOWNLOAD_FILES:
            const downloadFiles = require('./nodes/download_files');
            return resolve(await downloadFiles(state), (next_node) => next_node);
        default:
            return [state, null];
    }
}

(async () => {
    const initial_state = {
        m3u_file_path: process.argv[2] || null,
        urls: [],
        resolved_urls: [],
    };
    await amble(initial_state, Node.CHECK_M3U_FILE, direct);
    rl.close();
})();
