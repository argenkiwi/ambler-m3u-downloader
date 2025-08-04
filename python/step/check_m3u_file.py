import os
from typing import Optional


def check_m3u_file(m3u_file: Optional[str]) -> str:
    """
    Checks if an M3U file path is valid, prompting the user if not.
    """
    while not m3u_file or not os.path.exists(m3u_file) or not os.path.isfile(m3u_file) or not m3u_file.endswith('.m3u'):
        if m3u_file:
            print("Invalid file path. Please provide a valid .m3u file.")
            m3u_file = input('Please select an m3u file: ')
    return m3u_file
