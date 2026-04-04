import { Next } from '../ambler.js';
import { resolveKhinsiderUrl } from '../utils/resolve_khinsider_url.js';

const defaultUtils = { resolver: resolveKhinsiderUrl };

export function resolveUrls(edges, utils = defaultUtils) {
    return async (state) => {
        console.log('Resolving Khinsider URLs...');
        const resolvedUrls = await Promise.all(state.urls.map(async (url) => {
            if (url.startsWith('https://downloads.khinsider.com/game-soundtracks')) {
                return await utils.resolver(url);
            }
            return url;
        }));
        console.log('Finished resolving URLs.');
        return new Next(edges.onSuccess, { ...state, urls: resolvedUrls });
    };
}
