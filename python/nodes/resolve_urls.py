from utils.resolve_khinsider_url import resolve_khinsider_url
import asyncio

async def resolve_urls(state):
    """
    Resolves khinsider.com URLs to direct download links.
    """
    urls = state.urls

    async def run_resolver():
        tasks = []
        for url in urls:
            if url.startswith('https://downloads.khinsider.com/game-soundtracks'):
                tasks.append(resolve_khinsider_url(url))
            else:
                async def return_url(u):
                    return u
                tasks.append(return_url(url))
        return await asyncio.gather(*tasks)

    print("Resolving URLs...")
    resolved_urls = await run_resolver()
    state.urls = resolved_urls
    print("URLs resolved.")
    return state
