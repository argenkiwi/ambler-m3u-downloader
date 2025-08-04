from typing import Tuple

from common import Lead, State


def read_m3u_file(state: State) -> Tuple[State, Lead]:
    """
    Reads the content of the M3U file and extracts URLs.
    """
    with open(state['m3u_file'], 'r') as f:
        urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    state['urls'] = urls
    return state, Lead.PROMPT_OPTIONS
