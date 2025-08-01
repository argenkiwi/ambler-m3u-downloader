import { Next } from '../ambler.js';
import { saveM3UFile } from './save_m3u_file.js';
import { resolveKhinsiderUrl } from '../utils/resolve_khinsider_url.js';

export async function resolveUrls(state) {
    console.log("Resolving URLs...");
    const resolvedUrls = await Promise.all(state.urls.map(url => {
        if (url.startsWith('https://downloads.khinsider.com/game-soundtracks')) {
            return resolveKhinsiderUrl(url);
        }
        return url;
    }));
    console.log("URLs resolved.");
    return new Next(saveM3UFile, { ...state, urls: resolvedUrls });
}