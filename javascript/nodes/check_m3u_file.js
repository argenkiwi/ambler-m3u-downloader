const fs = require('fs');
const path = require('path');

const Node = {
    CHECK_M3U_FILE: 1,
    READ_M3U_FILE: 2,
    PROMPT_OPTIONS: 3,
    LIST_URLS: 4,
    RESOLVE_URLS: 5,
    SAVE_M3U_FILE: 6,
    DOWNLOAD_FILES: 7,
};

async function checkM3UFile(state, rl) {
    let m3u_file_path = state.m3u_file_path;

    const isValidM3U = (filePath) => {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile() && path.extname(filePath).toLowerCase() === '.m3u';
    };

    while (!isValidM3U(m3u_file_path)) {
        console.log("\nInvalid M3U file path provided or file does not exist.");
        m3u_file_path = await new Promise(resolve => {
            rl.question("Please enter the path to the M3U file: ", answer => {
                resolve(answer);
            });
        });
    }

    state.m3u_file_path = m3u_file_path;
    console.log(`Using M3U file: ${state.m3u_file_path}`);
    return [state, Node.READ_M3U_FILE];
}

module.exports = checkM3UFile;
