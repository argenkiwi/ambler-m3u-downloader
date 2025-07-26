const Node = {
    CHECK_M3U_FILE: 1,
    READ_M3U_FILE: 2,
    PROMPT_OPTIONS: 3,
    LIST_URLS: 4,
    RESOLVE_URLS: 5,
    SAVE_M3U_FILE: 6,
    DOWNLOAD_FILES: 7,
};

async function listUrls(state) {
    console.log("\n--- URLs ---");
    state.urls.forEach(url => console.log(url));
    console.log("------------");
    return [state, Node.PROMPT_OPTIONS];
}

module.exports = listUrls;

