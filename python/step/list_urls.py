from typing import Tuple

from common import Lead, State


async def list_urls(state: State) -> Tuple[State, Lead]:
    """
    Displays all the URLs currently in the application's state.
    """
    for url in state['urls']:
        print(url)

    return state, Lead.PROMPT_OPTIONS
