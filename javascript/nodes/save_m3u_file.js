const fs = require('fs');

async function saveM3UFile(state) {
    const filePath = state.m3u_file_path;
    const content = state.urls.join('\n');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Saved resolved URLs to ${filePath}`);
    return state;
}

module.exports = saveM3UFile;

