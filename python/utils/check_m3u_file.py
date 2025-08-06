import os
from typing import Optional


def check_m3u_file(m3u_file: Optional[str]) -> bool:
    """Checks if the provided M3U file path is valid."""
    return m3u_file and os.path.exists(m3u_file) and os.path.isfile(m3u_file) and m3u_file.endswith('.m3u')
