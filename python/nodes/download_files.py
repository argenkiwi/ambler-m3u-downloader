import asyncio
import os
from typing import Awaitable, Callable, TypedDict

from ambler import Next, Nextable
from state import State
from utils.download_file import download_file


class DownloadEdges(TypedDict):
    on_success: Nextable


class DownloadUtils(TypedDict):
    downloader: Callable[[str, str], Awaitable[None]]


_default_utils: DownloadUtils = {
    'downloader': download_file,
}


def download_files(edges: DownloadEdges, utils: DownloadUtils = _default_utils) -> Nextable:
    async def _node(state: State) -> Next[State]:
        if not state['m3u_file_path']:
            raise ValueError("M3U file path is not defined.")

        output_folder = os.path.splitext(os.path.basename(state['m3u_file_path']))[0]
        print(f"Downloading files to: {output_folder}")

        await asyncio.gather(*[utils['downloader'](url, output_folder) for url in state['urls']])

        print("All downloads complete.")
        return Next(edges['on_success'], state)

    return _node
