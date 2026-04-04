import asyncio
import os
import sys

from ambler import amble, node
from state import State
from nodes.check_m3u_file import check_m3u_file
from nodes.prompt_m3u_file import prompt_m3u_file
from nodes.read_m3u_file import read_m3u_file
from nodes.prompt_options import prompt_options
from nodes.list_urls import list_urls
from nodes.resolve_urls import resolve_urls
from nodes.save_m3u_file import save_m3u_file
from nodes.download_files import download_files

initial_state: State = {
    'm3u_file_path': os.path.expanduser(sys.argv[1]) if len(sys.argv) > 1 else None,
    'urls': [],
}

# Entry loop
check = node(lambda: check_m3u_file({'on_read': read, 'on_prompt': prompt}))
read = node(lambda: read_m3u_file({'on_success': options}))
prompt = node(lambda: prompt_m3u_file({'on_check': check}))

# Main menu
options = node(lambda: prompt_options({'on_list': list_node, 'on_resolve': resolve, 'on_download': download}))
list_node = node(lambda: list_urls({'on_success': options}))
resolve = node(lambda: resolve_urls({'on_success': save}))
save = node(lambda: save_m3u_file({'on_success': options}))

# Terminal node
download = node(lambda: download_files({'on_success': lambda state: None}))


async def main():
    await amble(check, initial_state)


if __name__ == "__main__":
    asyncio.run(main())
