import asyncio
import os

from utils.download_files import download_file


async def download_files(m3u_file: str, urls: list[str]):
    """
    Downloads all URLs in the application's state.
    """
    m3u_file_name = os.path.splitext(os.path.basename(m3u_file))[0]

    async def run_downloader():
        await asyncio.gather(*[download_file(url, m3u_file_name) for url in urls])

    print(f"Starting download of {len(urls)} files...")
    await run_downloader()
    print("All files downloaded.")
