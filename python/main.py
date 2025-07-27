import sys
from ambler import amble, resolve

from nodes.check_m3u_file import check_m3u_file
from nodes.read_m3u_file import read_m3u_file
from nodes.prompt_options import prompt_options
from nodes.list_urls import list_urls
from nodes.resolve_urls import resolve_urls
from nodes.download_files import download_files
from nodes.save_m3u_file import save_m3u_file

class Node:
    CHECK_M3U_FILE = 1
    READ_M3U_FILE = 2
    PROMPT_OPTIONS = 3
    LIST_URLS = 4
    RESOLVE_URLS = 5
    SAVE_M3U_FILE = 6
    DOWNLOAD_FILES = 7

class AppState:
    def __init__(self, m3u_file=None, urls=None):
        self.m3u_file = m3u_file
        self.urls = urls if urls is not None else []

    def __repr__(self):
        return f"AppState(m3u_file={self.m3u_file}, urls_count={len(self.urls)})"

def direct(state: AppState, node: int) -> tuple[AppState, int | None]:
    if node == Node.CHECK_M3U_FILE:
        return resolve(check_m3u_file(state), lambda _: Node.READ_M3U_FILE)
    elif node == Node.READ_M3U_FILE:
        return resolve(read_m3u_file(state), lambda _: Node.PROMPT_OPTIONS)
    elif node == Node.PROMPT_OPTIONS:
        return resolve(prompt_options(state), lambda option: {
            'list': Node.LIST_URLS,
            'resolve': Node.RESOLVE_URLS,
            'download': Node.DOWNLOAD_FILES,
            'quit': None
        }.get(option))
    elif node == Node.LIST_URLS:
        return resolve(list_urls(state), lambda _: Node.PROMPT_OPTIONS)
    elif node == Node.RESOLVE_URLS:
        return resolve(resolve_urls(state), lambda _: Node.SAVE_M3U_FILE)
    elif node == Node.SAVE_M3U_FILE:
        return resolve(save_m3u_file(state), lambda _: Node.PROMPT_OPTIONS)
    elif node == Node.DOWNLOAD_FILES:
        return resolve(download_files(state), lambda _: None)

async def main():
    initial_m3u_file = None
    if len(sys.argv) > 1:
        initial_m3u_file = sys.argv[1]

    initial_state = AppState(m3u_file=initial_m3u_file)
    start_node = Node.CHECK_M3U_FILE

    await amble(initial_state, start_node, direct)
    print("Application finished.")

if __name__ == "__main__":
    asyncio.run(main())
