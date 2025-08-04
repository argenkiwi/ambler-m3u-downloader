import asyncio
import sys

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

    def follow(lead: Lead):
        if lead == Lead.PROMPT_OPTIONS:
            return prompt_options
        elif lead == Lead.LIST_URLS:
            return list_urls
        elif lead == Lead.RESOLVE_URLS:
            return resolve_urls
        elif lead == Lead.READ_M3U_FILE:
            return read_m3u_file
        elif lead == Lead.DOWNLOAD_FILES:
            return download_files
        elif lead == Lead.SAVE_M3U_FILE:
            return save_m3u_file
        elif lead == Lead.CHECK_M3U_FILE:
            return check_m3u_file
        else:
            raise ValueError(f"Unknown lead: {lead}")

    await amble(initial_state, Lead.CHECK_M3U_FILE, follow)
    print("Application finished.")


if __name__ == "__main__":
    asyncio.run(main())
