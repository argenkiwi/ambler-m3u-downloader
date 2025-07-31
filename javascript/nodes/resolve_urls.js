import { resolveKhinsiderUrl } from '../utils/resolve_khinsider_url.js';
import { Next } from '../ambler.js';
import { nodes } from '../nodes.js';

export async function resolveUrls(state) {
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
    return new Next(nodes.saveM3UFile, state);
}
