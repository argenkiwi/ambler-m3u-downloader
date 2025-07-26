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

async function saveM3UFile(state) {
    const filePath = state.m3u_file_path;
    const content = state.urls.join('\n');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Saved resolved URLs to ${filePath}`);
    return [state, Node.PROMPT_OPTIONS];
}

module.exports = saveM3UFile;

