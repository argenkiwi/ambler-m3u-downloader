from utils.download_files import download_file
import asyncio
import os

def download_files(state):
    """
    Downloads all URLs in the application's state.
    """
    urls = state.urls
    m3u_file_name = os.path.splitext(os.path.basename(state.m3u_file))[0]

    async def run_downloader():
        await asyncio.gather(*[download_file(url, m3u_file_name) for url in urls])

    print(f"Starting download of {len(urls)} files...")
    asyncio.run(run_downloader())
    print("All files downloaded.")
    return state, None
