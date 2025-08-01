import os
from typing import Optional

from ambler import amble, Next
from utils.download_files import download_file
from utils.resolve_khinsider_url import resolve_khinsider_url


class AppState:
    def __init__(self, m3u_file=None, urls=None):
        self.m3u_file = m3u_file
        self.urls = urls if urls is not None else []

    def __repr__(self):
        return f"AppState(m3u_file={self.m3u_file}, urls_count={len(self.urls)})"


async def check_m3u_file(state) -> Next:
    """
    Checks if an M3U file path is valid, prompting the user if not.
    """
    m3u_file = state.m3u_file
    while not m3u_file or not os.path.exists(m3u_file) or not os.path.isfile(m3u_file) or not m3u_file.endswith('.m3u'):
        if m3u_file:
            print("Invalid file path. Please provide a valid .m3u file.")
        m3u_file = input('Please select an m3u file: ')
    state.m3u_file = m3u_file
    return Next(read_m3u_file, state)


async def read_m3u_file(state) -> Next:
    """
    Reads the content of the M3U file and extracts URLs.
    """
    with open(state.m3u_file, 'r') as f:
        urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    state.urls = urls
    return Next(prompt_options, state)


async def prompt_options(state) -> Optional[Next]:
    """
    Presents the user with available actions and returns their selection.
    """
    urls = state.urls
    options = ['quit', 'list']
    can_resolve = any(url.startswith('https://downloads.khinsider.com/game-soundtracks') for url in urls)
    if can_resolve:
        options.append('resolve')
    else:
        options.append('download')

    print('Please select an option:')
    for i, option in enumerate(options):
        print(f'{i + 1}. {option}')

    selected_option_index = -1
    while selected_option_index < 0 or selected_option_index >= len(options):
        try:
            selected_option_index = int(input('Enter your choice: ')) - 1
        except ValueError:
            pass # Invalid input, loop will continue

    selected_option = options[selected_option_index]

    match selected_option:
        case 'quit':
            return None
        case 'list':
            return Next(list_urls, state)
        case 'resolve':
            return Next(resolve_urls, state)
        case 'download':
            return Next(download_files, state)
        case _:
            print("Invalid choice.")
            return Next(prompt_options, state)


async def list_urls(state) -> Next:
    """
    Displays all the URLs currently in the application's state.
    """
    for url in state.urls:
        print(url)

    return Next(prompt_options, state)


async def resolve_urls(state) -> Next:
    """
    Resolves khinsider.com URLs to direct download links.
    """
    urls = state.urls

    async def run_resolver():
        tasks = []
        for url in urls:
            if url.startswith('https://downloads.khinsider.com/game-soundtracks'):
                tasks.append(resolve_khinsider_url(url))
            else:
                async def return_url(u):
                    return u

                tasks.append(return_url(url))
        return await asyncio.gather(*tasks)

    print("Resolving URLs...")
    resolved_urls = await run_resolver()
    state.urls = resolved_urls
    print("URLs resolved.")
    return Next(save_m3u_file, state)


async def download_files(state) -> Next:
    """
    Downloads all URLs in the application's state.
    """
    urls = state.urls
    m3u_file_name = os.path.splitext(os.path.basename(state.m3u_file))[0]

    async def run_downloader():
        await asyncio.gather(*[download_file(url, m3u_file_name) for url in urls])

    print(f"Starting download of {len(urls)} files...")
    await run_downloader()
    print("All files downloaded.")
    return Next(prompt_options, state)

async def save_m3u_file(state) -> Next:
    """
    Saves the resolved URLs back to the M3U file.
    """
    with open(state.m3u_file, 'w') as f:
        for url in state.urls:
            f.write(url + '\n')
    print(f"Resolved URLs saved to {state.m3u_file}")
    return Next(prompt_options, state)

async def main():
    initial_m3u_file = None
    if len(sys.argv) > 1:
        initial_m3u_file = sys.argv[1]

    initial_state = AppState(m3u_file=initial_m3u_file)

    await amble(check_m3u_file, initial_state)
    print("Application finished.")


if __name__ == "__main__":
    import asyncio
    import sys

    asyncio.run(main())
