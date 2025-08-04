from typing import Tuple

from common import Lead, State


async def save_m3u_file(state: State) -> Tuple[State, Lead]:
    """
    Saves the resolved URLs back to the M3U file.
    """
    with open(state['m3u_file'], 'w') as f:
        for url in state['urls']:
            f.write(url + '\n')
    print(f"Resolved URLs saved to {state['m3u_file']}")
    return state, Lead.PROMPT_OPTIONS
