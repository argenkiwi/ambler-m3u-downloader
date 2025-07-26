const fs = require('fs');

const Node = require('../nodes');

async function saveM3UFile(state) {
    const filePath = state.m3u_file_path;
    const content = state.urls.join('\n');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Saved resolved URLs to ${filePath}`);
    return [state, Node.PROMPT_OPTIONS];
}

module.exports = saveM3UFile;

