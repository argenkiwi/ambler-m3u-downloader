from typing import Tuple, Optional

from common import Lead, State


async def prompt_options(state: State) -> Tuple[State, Optional[Lead]]:
    """
    Presents the user with available actions and returns their selection.
    """
    urls = state['urls']
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
            pass  # Invalid input, loop will continue

    selected_option = options[selected_option_index]

    match selected_option:
        case 'quit':
            return state, None
        case 'list':
            return state, Lead.LIST_URLS
        case 'resolve':
            return state, Lead.RESOLVE_URLS
        case 'download':
            return state, Lead.DOWNLOAD_FILES
        case _:
            print("Invalid choice.")
            return state, Lead.PROMPT_OPTIONS
