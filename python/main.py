import asyncio
import os
import sys
from enum import Enum, auto
from typing import Tuple, Optional, TypedDict

from ambler import amble
from utils.check_m3u_file import check_m3u_file
from utils.download_files import download_files
from utils.list_urls import list_urls
from utils.prompt_options import prompt_options, Option
from utils.prompt_m3u_file import prompt_m3u_file
from utils.read_m3u_file import read_m3u_file
from utils.resolve_urls import resolve_urls
from utils.save_m3u_file import save_m3u_file


class State(TypedDict):
    m3u_file: Optional[str]
    urls: list[str]


class Lead(Enum):
    CHECK_M3U_FILE = auto()
    PROMPT_M3U_FILE = auto()
    READ_M3U_FILE = auto()
    PROMPT_OPTIONS = auto()
    LIST_URLS = auto()
    RESOLVE_URLS = auto()
    DOWNLOAD_FILES = auto()
    SAVE_M3U_FILE = auto()


async def main():
    initial_m3u_file = None
    if len(sys.argv) > 1:
        initial_m3u_file = os.path.expanduser(sys.argv[1])

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
            return state, Lead.SAVE_M3U_FILE
        elif lead == Lead.READ_M3U_FILE:
            state['urls'] = read_m3u_file(state['m3u_file'])
            return state, Lead.PROMPT_OPTIONS
        elif lead == Lead.DOWNLOAD_FILES:
            await download_files(state['m3u_file'], state['urls'])
            return state, None
        elif lead == Lead.SAVE_M3U_FILE:
            save_m3u_file(state['m3u_file'], state['urls'])
            return state, Lead.PROMPT_OPTIONS
        elif lead == Lead.CHECK_M3U_FILE:
            if check_m3u_file(state['m3u_file']):
                return state, Lead.READ_M3U_FILE
            else:
                return state, Lead.PROMPT_M3U_FILE
        elif lead == Lead.PROMPT_M3U_FILE:
            state['m3u_file'] = prompt_m3u_file()
            if state['m3u_file'] is None:
                return state, None
            return state, Lead.CHECK_M3U_FILE

    await amble(initial_state, Lead.CHECK_M3U_FILE, follow)
    print("Application finished.")


if __name__ == "__main__":
    asyncio.run(main())
