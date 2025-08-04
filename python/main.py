import asyncio
import sys
from typing import Tuple, Optional

from ambler import amble
from common import State, Lead
from step.check_m3u_file import check_m3u_file
from step.download_files import download_files
from step.list_urls import list_urls
from step.prompt_options import prompt_options, Option
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
            option = prompt_options(state['urls'])
            if option == Option.DOWNLOAD:
                return state, Lead.DOWNLOAD_FILES
            elif option == Option.RESOLVE:
                return state, Lead.RESOLVE_URLS
            elif option == Option.LIST:
                return state, Lead.LIST_URLS
            elif option == Option.QUIT:
                return state, None
            elif option is None:
                return state, Lead.PROMPT_OPTIONS
        elif lead == Lead.LIST_URLS:
            list_urls(state['urls'])
            return state, Lead.PROMPT_OPTIONS
        elif lead == Lead.RESOLVE_URLS:
            state['urls'] = await resolve_urls(state['urls'])
            return state, Lead.PROMPT_OPTIONS
        elif lead == Lead.READ_M3U_FILE:
            state['urls'] = read_m3u_file(state['m3u_file'])
            return state, Lead.PROMPT_OPTIONS
        elif lead == Lead.DOWNLOAD_FILES:
            await download_files(state['m3u_file'], state['urls'])
            return state, Lead.PROMPT_OPTIONS
        elif lead == Lead.SAVE_M3U_FILE:
            save_m3u_file(state['m3u_file'], state['urls'])
            return state, Lead.PROMPT_OPTIONS
        elif lead == Lead.CHECK_M3U_FILE:
            state['m3u_file'] = check_m3u_file(state['m3u_file'])
            return state, Lead.READ_M3U_FILE

    await amble(initial_state, Lead.CHECK_M3U_FILE, follow)
    print("Application finished.")


if __name__ == "__main__":
    asyncio.run(main())
