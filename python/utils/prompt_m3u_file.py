import os
from typing import Optional


def prompt_m3u_file() -> Optional[str]:
    """
    Prompts the user to enter the path to an M3U file.
    Expands the tilde character to the user's home directory.
    Returns None if the user enters an empty path.
    """
    path = input("Please enter the path to your M3U file: ")
    if not path:
        return None
    return os.path.expanduser(path)