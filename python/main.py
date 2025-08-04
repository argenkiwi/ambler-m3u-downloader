import asyncio
import sys
from typing import Tuple, Optional

from ambler import amble
from common import State, Lead
from step.check_m3u_file import check_m3u_file
from step.download_files import download_files
from step.list_urls import list_urls
from step.prompt_options import prompt_options
from step.read_m3u_file import read_m3u_file
from step.resolve_urls import resolve_urls
from step.save_m3u_file import save_m3u_file


async def main():
    initial_m3u_file = None
    if len(sys.argv) > 1:
        initial_m3u_file = sys.argv[1]

    initial_state: State = {'m3u_file': initial_m3u_file,
                            'urls': []}

    async def follow(lead: Lead, state: State) -> Tuple[State, Optional[Lead]]:
        if lead == Lead.PROMPT_OPTIONS:
            return prompt_options(state)
        elif lead == Lead.LIST_URLS:
            return list_urls(state)
        elif lead == Lead.RESOLVE_URLS:
            return await resolve_urls(state)
        elif lead == Lead.READ_M3U_FILE:
            return read_m3u_file(state)
        elif lead == Lead.DOWNLOAD_FILES:
            return await download_files(state)
        elif lead == Lead.SAVE_M3U_FILE:
            return save_m3u_file(state)
        elif lead == Lead.CHECK_M3U_FILE:
            return check_m3u_file(state)

    await amble(initial_state, Lead.CHECK_M3U_FILE, follow)
    print("Application finished.")


if __name__ == "__main__":
    asyncio.run(main())
