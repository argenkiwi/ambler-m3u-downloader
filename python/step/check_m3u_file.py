import os
from typing import Tuple

from common import State, Lead


async def check_m3u_file(state: State) -> Tuple[State, Lead]:
    """
    Checks if an M3U file path is valid, prompting the user if not.
    """
    m3u_file = state['m3u_file']
    while not m3u_file or not os.path.exists(m3u_file) or not os.path.isfile(m3u_file) or not m3u_file.endswith('.m3u'):
        if m3u_file:
            print("Invalid file path. Please provide a valid .m3u file.")
        m3u_file = input('Please select an m3u file: ')
    state['m3u_file'] = m3u_file
    return state, Lead.READ_M3U_FILE
