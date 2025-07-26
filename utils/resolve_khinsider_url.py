
import aiohttp
from bs4 import BeautifulSoup

async def resolve_khinsider_url(url):
    if not url.startswith('https://downloads.khinsider.com/game-soundtracks'):
        return url
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            response.raise_for_status()
            content = await response.text()
            soup = BeautifulSoup(content, 'html.parser')
            audio_player = soup.find('audio')
            if audio_player:
                return audio_player['src']
    return url
