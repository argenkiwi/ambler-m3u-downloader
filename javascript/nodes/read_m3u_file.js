const fs = require('fs');

const Node = {
    CHECK_M3U_FILE: 1,
    READ_M3U_FILE: 2,
    PROMPT_OPTIONS: 3,
    LIST_URLS: 4,
    RESOLVE_URLS: 5,
    SAVE_M3U_FILE: 6,
    DOWNLOAD_FILES: 7,
};

async function readM3UFile(state) {
    const filePath = state.m3u_file_path;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const urls = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            urls.push(trimmedLine);
        }
    }

    state.urls = urls;
    console.log(`Found ${urls.length} URLs in the M3U file.`);
    return [state, Node.PROMPT_OPTIONS];
}

module.exports = readM3UFile;
