
import os
import aiohttp

async def download_file(url, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    filename = url.split('/')[-1]
    filepath = os.path.join(output_folder, filename)
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            response.raise_for_status()
            with open(filepath, 'wb') as f:
                f.write(await response.read())
