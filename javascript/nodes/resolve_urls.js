const Node = {
    CHECK_M3U_FILE: 1,
    READ_M3U_FILE: 2,
    PROMPT_OPTIONS: 3,
    LIST_URLS: 4,
    RESOLVE_URLS: 5,
    SAVE_M3U_FILE: 6,
    DOWNLOAD_FILES: 7,
};

const resolveKhinsiderUrl = require('../utils/resolve_khinsider_url');

async function resolveUrls(state) {
    console.log("Resolving Khinsider URLs...");
    const resolvedUrls = await Promise.all(state.urls.map(async (url) => {
        if (url.startsWith("https://downloads.khinsider.com/game-soundtracks")) {
            try {
                const resolved = await resolveKhinsiderUrl(url);
                console.log(`Resolved ${url} to ${resolved}`);
                return resolved;
            } catch (error) {
                console.error(`Error resolving ${url}: ${error.message}`);
                return url; // Return original URL if resolution fails
            }
        } else {
            return url;
        }
    }));
    state.urls = resolvedUrls;
    return [state, Node.SAVE_M3U_FILE];
}

module.exports = resolveUrls;
