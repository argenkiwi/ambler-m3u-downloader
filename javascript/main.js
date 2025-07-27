const { amble } = require('./ambler');
const fs = require('fs');
const path = require('path');

const Node = require('./nodes');

const checkM3UFile = require('./nodes/check_m3u_file');
const readM3UFile = require('./nodes/read_m3u_file');
const promptOptions = require('./nodes/prompt_options');
const listUrls = require('./nodes/list_urls');
const resolveUrls = require('./nodes/resolve_urls');
const saveM3UFile = require('./nodes/save_m3u_file');
const downloadFiles = require('./nodes/download_files');

async function direct(state, node) {
    if (node === Node.CHECK_M3U_FILE) {
        return [await checkM3UFile(state), Node.READ_M3U_FILE];
    } else if (node === Node.READ_M3U_FILE) {
        return [await readM3UFile(state), Node.PROMPT_OPTIONS];
    } else if (node === Node.PROMPT_OPTIONS) {
        const option = await promptOptions(state);
        const nextNode = {
            'list': Node.LIST_URLS,
            'resolve': Node.RESOLVE_URLS,
            'download': Node.DOWNLOAD_FILES,
            'quit': null
        }[option];
        return [state, nextNode];
    } else if (node === Node.LIST_URLS) {
        await listUrls(state);
        return [state, Node.PROMPT_OPTIONS];
    } else if (node === Node.RESOLVE_URLS) {
        const newState = await resolveUrls(state);
        return [newState, Node.SAVE_M3U_FILE];
    } else if (node === Node.SAVE_M3U_FILE) {
        await saveM3UFile(state);
        return [state, Node.PROMPT_OPTIONS];
    } else if (node === Node.DOWNLOAD_FILES) {
        await downloadFiles(state);
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
})();
